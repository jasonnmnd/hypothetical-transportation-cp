from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import SendAnnouncementSerializer

from django.contrib.auth import get_user_model
from backend.models import School, Route
from django.core import mail
from django.shortcuts import get_object_or_404

from backend.geo_utils import get_straightline_distance, LEN_OF_MILE


class SendAnnouncementAPI(generics.GenericAPIView):
    """
    This API provides the ability to post announcements to the specified users

    1. all parents with children attending a given school
    2. all parents with children on a given route
    3. all users of the system
    """
    serializer_class = SendAnnouncementSerializer
    permission_classes = [
        permissions.AllowAny
    ]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        recipients = list()
        email_context = ''

        id_type = serializer.data.get("id_type")
        object_id = serializer.data.get("object_id")
        if id_type == "ROUTE":
            try:
                route = Route.objects.get(pk=object_id)
                email_context = f"You are being sent this email because your child is a member of {route.name}\n"
                students_queryset = route.students
            except Route.DoesNotExist:
                return Response({'object_id': ['Route with this ID does not exist']},
                                status=status.HTTP_400_BAD_REQUEST)
            user_queryset = get_user_model().objects.filter(id__in=students_queryset.values('guardian_id')).distinct()
            recipients.extend(user_queryset.values_list('email', flat=True))

        elif id_type == "SCHOOL":
            try:
                school = School.objects.get(pk=object_id)
                email_context = f"You are being sent this email because your child is a member of {school.name}\n"
                students_queryset = school.students
            except School.DoesNotExist:
                return Response({'object_id': ['School with this ID does not exist']},
                                status=status.HTTP_400_BAD_REQUEST)
            user_queryset = get_user_model().objects.filter(id__in=students_queryset.values('guardian_id')).distinct()
            recipients.extend(user_queryset.values_list('email', flat=True))

        elif id_type == "ALL":
            email_context = f"You are being sent this email because you are a user of this system\n"
            recipients.extend(get_user_model().objects.values_list('email', flat=True))

        # Filter out emails ending in example.com
        recipients = [recipient for recipient in recipients if not recipient.endswith('example.com')]

        with mail.get_connection() as connection:
            mail.EmailMessage(
                subject=serializer.data.get('subject'),
                body=f"{email_context}{serializer.data.get('body')}",
                from_email='DONOTREPLYEXAMPLE@example.com',
                bcc=recipients,
                connection=connection,
            ).send()
        return Response(serializer.data, status=status.HTTP_200_OK)


class SendRouteAnnouncementAPI(generics.GenericAPIView):
    """
    This API provides the ability to post announcements to the specified users

    1. all parents with children attending a given school
    2. all parents with children on a given route
    3. all users of the system
    """
    serializer_class = SendAnnouncementSerializer
    permission_classes = [
        permissions.AllowAny
    ]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        recipients = list()
        email_context = ''

        id_type = serializer.data.get("id_type")
        object_id = serializer.data.get("object_id")
        if id_type == "ROUTE":
            try:
                route = Route.objects.get(pk=object_id)
                email_context = f"You are being sent this email because your child is a member of {route.name}\n"
                students_queryset = route.students
            except Route.DoesNotExist:
                return Response({'object_id': ['Route with this ID does not exist']},
                                status=status.HTTP_400_BAD_REQUEST)
            user_queryset = get_user_model().objects.filter(id__in=students_queryset.values('guardian_id')).distinct()
            recipients.extend(user_queryset.values_list('email', flat=True))

        elif id_type == "SCHOOL":
            try:
                school = School.objects.get(pk=object_id)
                email_context = f"You are being sent this email because your child is a member of {school.name}\n"
                students_queryset = school.students
            except School.DoesNotExist:
                return Response({'object_id': ['School with this ID does not exist']},
                                status=status.HTTP_400_BAD_REQUEST)
            user_queryset = get_user_model().objects.filter(id__in=students_queryset.values('guardian_id')).distinct()
            recipients.extend(user_queryset.values_list('email', flat=True))

        elif id_type == "ALL":
            email_context = f"You are being sent this email because you are a user of this system\n"
            recipients.extend(get_user_model().objects.values_list('email', flat=True))

        # Filter out emails ending in example.com
        recipients = [recipient for recipient in recipients if not recipient.endswith('example.com')]

        for recipient in recipients:
            user = get_user_model().objects.get(email=recipient)
            with mail.get_connection() as connection:
                mail.EmailMessage(
                    subject=serializer.data.get('subject'),
                    body=f"{email_context}{serializer.data.get('body')}\n\n{generate_attachment(user)}",
                    from_email='DONOTREPLYEXAMPLE@example.com',
                    to=[recipient],
                    connection=connection,
                ).send()
        return Response(serializer.data, status=status.HTTP_200_OK)


def generate_attachment(user):
    """
    Generates information as required by 5.1
    :param user:
    :return:
    """
    content = list()
    for student in user.students.all():
        content.append(f'- {student.full_name}\n')
        if student.routes:
            content.append(f'   - Route: {student.routes.name}\n')
            content.append(f'       - Description: {student.routes.name}\n')
            student_inrange_stops = [stop for stop in student.routes.stops.all() if
                                     get_straightline_distance(student.guardian.latitude, student.guardian.longitude,
                                                               stop.latitude,
                                                               stop.longitude) < 5 * LEN_OF_MILE]
            content.append(f'   - In-Range Stops: Name, Pickup Time, Drop-off Time, Location\n')
            for stop in student_inrange_stops:
                content.append(f'       - {stop.name} {stop.pickup_time} {stop.dropoff_time} {stop.location}\n')
    return ''.join(content)
