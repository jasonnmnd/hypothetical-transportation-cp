from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from .serializers import SendAnnouncementSerializer

from django.contrib.auth import get_user_model
from django.core.mail.message import EmailMultiAlternatives
from backend.models import School, Route
from django.core import mail
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from backend.geo_utils import get_straightline_distance, LEN_OF_MILE
from backend.permissions import IsAdmin, IsSchoolStaff, is_school_staff


def send_rich_format_email(template: str, template_context: dict, subject: str, to: list, bcc: list):
    """
    Send email with HTML attachment
    :param subject: subject of email
    :param template: email template for content
    :param template_context: context for template
    :param to: email recipients
    :param bcc: email recipients (BCC)
    :return: None
    """
    html_message = render_to_string(template, template_context)
    plain_message = strip_tags(html_message)
    # mail.send_mail(subject, plain_message, from_email='abc', to=to, bcc=bcc)
    email = EmailMultiAlternatives(subject, plain_message, settings.EMAIL_FROM, to=to, bcc=bcc)
    email.attach_alternative(html_message, 'text/html')
    email.send()


def get_users_where_student_route_id(route_id: int):
    route = get_object_or_404(Route, pk=route_id)
    students_queryset = route.students
    return get_user_model().objects.filter(id__in=students_queryset.values('guardian_id')).distinct()


def get_users_where_student_school_id(school_id: int):
    school = get_object_or_404(School, pk=school_id)
    students_queryset = school.students
    return get_user_model().objects.filter(id__in=students_queryset.values('guardian_id')).distinct()


def get_users_all():
    return get_user_model().objects.values_list('email', flat=True)


def get_recipients_from_email_query(serializer: SendAnnouncementSerializer):
    """
    Get email recipients list from announcement query with SendAnnouncementSerializer

    :param serializer: SendAnnouncementSerializer expected
    :return: list of recipient emails, excluding those that end with example.com
    """
    recipients = list()
    id_type = serializer.data.get("id_type")
    object_id = serializer.data.get("object_id")
    if id_type == "ROUTE":
        recipients.extend(get_users_where_student_route_id(object_id).values_list('email', flat=True))
    elif id_type == "SCHOOL":
        recipients.extend(get_users_where_student_school_id(object_id).values_list('email', flat=True))
    elif id_type == "ALL":
        recipients.extend(get_users_all().values_list('email', flat=True))
    recipients = [recipient for recipient in recipients if not recipient.endswith('example.com')]
    return recipients


def block_staff_emails(user, serializer) -> bool:
    block = False
    if is_school_staff(user):
        id_type = serializer.data.get("id_type")
        object_id = serializer.data.get("object_id")
        if id_type == "ROUTE":
            route = get_object_or_404(Route, id=object_id)
            if user.managed_schools.filter(id=route.school.id).count() == 0:
                block = True
        elif id_type == "SCHOOL":
            school = get_object_or_404(School, id=object_id)
            if user.managed_schools.filter(id=school.id).count() == 0:
                block = True
        elif id_type == "ALL":
            block = True
    return block


class SendAnnouncementAPI(generics.GenericAPIView):
    """
    Sends an email announcement to the specified group
    """
    serializer_class = SendAnnouncementSerializer
    permission_classes = [IsAdmin | IsSchoolStaff]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if block_staff_emails(request.user, serializer):
            content = {'detail': 'This email is not permitted.  Please check your managed schools'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        recipients = get_recipients_from_email_query(serializer)
        custom_context = request.data.get('context', None)
        send_rich_format_email(template=serializer.data.get("template", "announcement_email.html"),
                               template_context={"body": serializer.data.get('body'), "context": custom_context},
                               subject=serializer.data.get('subject'), to=[], bcc=recipients)
        response_context = {
            "recipients": recipients,
            **serializer.data
        }
        return Response(response_context, status=status.HTTP_200_OK)


class SendRouteAnnouncementAPI(generics.GenericAPIView):
    """
    Sends an email announcement to the specified group

    Email content will include information from the parent interface, tailored to each parent.
    """
    serializer_class = SendAnnouncementSerializer
    permission_classes = [IsAdmin | IsSchoolStaff]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if block_staff_emails(request.user, serializer):
            content = {'detail': 'This email is not permitted.  Please check your managed schools'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        recipients = get_recipients_from_email_query(serializer)
        custom_context = request.data.get('context', None)
        for recipient in recipients:
            user = get_user_model().objects.get(email=recipient)
            student_info = generate_student_info(user)
            send_rich_format_email(template=serializer.data.get("template", "route_announcement_email.html"),
                                   template_context={"body": serializer.data.get('body'),
                                                     "student_info": student_info,
                                                     "context": custom_context},
                                   subject=serializer.data.get('subject'), to=[recipient], bcc=[])

        response_context = {
            "recipients": recipients,
            **serializer.data
        }
        return Response(response_context, status=status.HTTP_200_OK)


def generate_student_info(user):
    """
    Generates information as required by 5.1
    :param user: User object
    :return: list of objects corresponding to the parent view of students and related informaion
        [
            {
                "full_name": "",
                "school": "",
                "routes": {
                    "route_name":"",
                    "description":"",
                },
                "stops": [
                    {
                        "stop_name":"",
                        "pickup_time":"",
                        "dropoff_time":"",
                        "location":"",
                    },
                    ...
                ]
            },
            ...
        ]
    """
    students = list()
    for student in user.students.all():
        student_info = dict()
        student_info['full_name'] = student.full_name
        student_info['school'] = student.school.name
        if student.routes:
            student_info['routes'] = {
                'route_name': student.routes.name,
                'description': student.routes.description,
            }
            student_inrange_stops = [stop for stop in student.routes.stops.all() if
                                     get_straightline_distance(student.guardian.latitude, student.guardian.longitude,
                                                               stop.latitude,
                                                               stop.longitude) < 0.3 * LEN_OF_MILE]
            student_info['stops'] = list()
            for stop in student_inrange_stops:
                student_info['stops'].append({
                    "stop_name": stop.name,
                    "pickup_time": stop.pickup_time,
                    "dropoff_time": stop.dropoff_time,
                    "location": stop.location,
                })
        students.append(student_info)
    return students
