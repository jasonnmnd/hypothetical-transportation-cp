from urllib import response
from django.contrib.auth import get_user_model
from django.db import transaction, IntegrityError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, serializers
from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
import requests, json
import os
from datetime import time, datetime
from geopy.geocoders import Nominatim, GoogleV3
from django.core.exceptions import ObjectDoesNotExist
from .models import School, Route, Student, Stop
from .serializers import UserSerializer, StudentSerializer, RouteSerializer, SchoolSerializer, FormatStudentSerializer, \
    FormatRouteSerializer, FormatUserSerializer, EditUserSerializer, StopSerializer, CheckInrangeSerializer, \
    LoadUserSerializer, LoadModelDataSerializer, find_school_match_candidates, school_names_match, \
    StaffEditUserSerializer, StaffEditSchoolSerializer, StaffStudentSerializer, LoadStudentSerializer, \
    LoadStudentSerializerStrict, ExposeUserSerializer, ExposeUserInputEmailSerializer
from .search import DynamicSearchFilter
from .customfilters import StudentCountShortCircuitFilter
from .permissions import is_admin, is_school_staff, is_driver, IsAdminOrReadOnly, IsAdmin, IsSchoolStaff, is_guardian
from django.shortcuts import get_object_or_404
from .geo_utils import get_straightline_distance, LEN_OF_MILE
from .nav_utils import navigation_link_dropoff, navigation_link_pickup
from collections import defaultdict
from django.contrib.auth.models import Group

MAX_STOPS_IN_ONE_CALL = 1

os.environ['DISTANCE_MATRIX_API_URL'] = 'https://maps.googleapis.com/maps/api/distancematrix/json'
os.environ['DISTANCE_MATRIX_API_KEY'] = 'AIzaSyAvdhlh9wi-jrCK8fmHRChW5qhIpHByv7U'


def get_filter_dict(model):
    """
    Constructs a dictionary of fields to search properties desired.

    Assumes __all__ would be a safe alternative, and allows checking isnull for valid fields.

    Based on this representation for the backend django-filter: https://django-filter.readthedocs.io/en/stable/ref/filterset.html#declaring-filterable-fields
    :param model: Model to be filtered
    :return:
    """
    fields_dict = dict()
    for field in model._meta.get_fields():
        permission_list = ['exact']
        if field.null:
            permission_list.append('isnull')
        fields_dict[field.name] = permission_list
    return fields_dict


def parse_repr(repr_str: str) -> dict:
    """
    Parses a REST Django Serializer str representation into a dictionary of fields.

    Assumes the serializer name is not used and can be discarded.
    :param repr_str: string representation
    :return: dictionary representing parsed representation string's fields
    """
    repr_fields = dict()
    repr_str_components = repr_str.replace(' ', '').split('\n')
    for key_value_pair in repr_str_components[1:]:
        equal_dex = key_value_pair.find('=')
        open_paren_dex = key_value_pair.find('(')
        key, value = key_value_pair[:equal_dex], key_value_pair[equal_dex + 1: open_paren_dex]
        repr_fields[key] = value
    return repr_fields


def datetime_h_m_s_to_sec(date: datetime) -> int:
    """
    Change a datetime object into a value in seconds
    :param date: datetime object
    :return: integer value representing seconds
    """
    return date.hour * 3600 + date.minute * 60 + date.second


def sec_to_datetime_h_m_s(seconds: int) -> datetime:
    """
    Change some integer into a datetime object in format HH:MM:SS
    :param seconds: seconds
    :return: datetime object
    """
    h = seconds // 3600
    m = (seconds % 3600) // 60
    s = seconds % 60
    return time(h, m, s)


def distance_matrix_api(matrix: list) -> json:
    """
    Given some list of addresses, fetch a distance matrix api from google
    :param matrix: list of addresses to find the time between
    :return: json response from google distance matrix api
    """
    url = os.environ.get('DISTANCE_MATRIX_API_URL')
    key = os.environ.get('DISTANCE_MATRIX_API_KEY')
    params = {'key': key, 'origins': matrix, 'destinations': matrix}
    req = requests.get(url=url, params=params)
    return json.loads(req.content)


def get_information_related_to_a_stop(stop: Stop):
    """
    Given some stop, find the information corresponding to every stop on the same route
    :param stop: valid Stop object 
    :return: int, int, Stop[], json -> the school start and stop time, the list of stops on the same route,
    and the distance matrix json
    """
    route = stop.route
    school = route.school

    school_start_time = datetime_h_m_s_to_sec(school.bus_arrival_time)
    school_letout_time = datetime_h_m_s_to_sec(school.bus_departure_time)
    matrix = ""
    matrices = []
    stops = Stop.objects.filter(route=route).distinct().order_by('stop_number')
    if len(stops) == 0:
        return 0, 0, 0, 0, False  # this is stupid
    stop_count = 1
    starting = True

    for stop in stops:
        if stop_count == 1 and starting:
            matrix = school.address + f'|{stop.latitude}, {stop.longitude}'
            starting = False
        elif stop_count == 1 and not starting:
            matrices.append(matrix)
            matrix = f'|{hold.latitude}, {hold.longitude}' + f'|{stop.latitude}, {stop.longitude}'
        else:
            matrix = matrix + f'|{stop.latitude}, {stop.longitude}'
        if stop_count == MAX_STOPS_IN_ONE_CALL:
            stop_count = 1
        else:
            stop_count = stop_count + 1
        hold = stop
    matrices.append(matrix)

    return school_start_time, school_letout_time, stops, matrices, True


def update_bus_times_for_stops_related_to_stop(stop: Stop):
    """
    Given some stop, calculate and update the dropoff and pickup times between each stop 
    on the related route, given some order determined by the states
    :param stop: valid Stop object
    :return: datetime[], datetime[], Stop[] -> list of dropoff times, list of pickup times, and list of corresponding stops
    """
    school_start_time, school_letout_time, stops, matrices, actions = get_information_related_to_a_stop(stop)
    if not actions:
        return response

    times = {}
    starting = True
    for group in matrices:
        res = distance_matrix_api(group)
        print(res)
        if starting:
            times['rows'] = res['rows']
            starting = False
        else:
            times['rows'] = times['rows'] + res['rows']

    school_to_stop_1 = times['rows'][0]['elements'][1]['duration']['value']
    stop_n_to_school = times['rows'][len(stops) + len(matrices) - 1]['elements'][0]['duration']['value']
    # setup, handle the edge case of leaving the school
    desc_times, asc_times = [], [school_to_stop_1]
    running_desc_time, running_asc_time = 0, school_to_stop_1
    call_count = 0
    for stop_num in range(1, len(stops)):
        if (stop_num - 1) % MAX_STOPS_IN_ONE_CALL == 0 and stop_num > 1:
            call_count = call_count + 1
        if stop_num % (MAX_STOPS_IN_ONE_CALL) == 0:
            prev_element = MAX_STOPS_IN_ONE_CALL - 1
            prev_row = stop_num + call_count
            next_element = 1
            next_row = stop_num + call_count + 1
        else:
            prev_element = stop_num % MAX_STOPS_IN_ONE_CALL - 1
            prev_row = stop_num + call_count
            next_row = stop_num + call_count
            next_element = (stop_num + call_count) % (MAX_STOPS_IN_ONE_CALL) + 1

        prev_stop = times['rows'][prev_row]['elements'][prev_element]['duration']['value']
        running_desc_time = running_desc_time + prev_stop  # this is stop i to stop i-1
        desc_times.append(running_desc_time)

        next_stop = times['rows'][next_row]['elements'][next_element]['duration']['value']
        running_asc_time = running_asc_time + next_stop  # this is stop i to stop i+1
        asc_times.append(running_asc_time)

    if len(stops) == 1:
        desc_times.append(times['rows'][1]['elements'][0]['duration']['value'])
    else:
        running_desc_time = running_desc_time + stop_n_to_school
        desc_times.append(running_desc_time)

    dropoff_times = [sec_to_datetime_h_m_s((school_letout_time + time) % (24 * 3600)) for time in asc_times]

    pickup_times = []
    for time in desc_times:
        time_in_day = sec_to_datetime_h_m_s((school_start_time - time) % (24 * 3600))
        pickup_times.append(time_in_day)

    stop_num = 0
    for stop in stops:
        stop.pickup_time = pickup_times[stop_num]
        stop.dropoff_time = dropoff_times[stop_num]
        stop.save(update_fields=['pickup_time', 'dropoff_time'])
        stop_num = stop_num + 1

    return response


def update_all_stops_related_to_school(school: School):
    """
    Given some school, update every stop associated.
    :param school: valid School object
    """
    related_routes = Route.objects.filter(school=school).distinct().order_by('id')
    for route in related_routes:
        # this is stupid
        stops = Stop.objects.filter(route=route).distinct().order_by('stop_number')
        if stops:
            update_bus_times_for_stops_related_to_stop(stops[0])


class StopPlannerAPI(generics.GenericAPIView):
    serializer_class = CheckInrangeSerializer
    permission_classes = [
        permissions.AllowAny
    ]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            students_response = []
            students = serializer.validated_data['students']
            stops = serializer.validated_data['stops']
            for student in students:
                has_inrange_stop = False
                student_coord = student['latitude'], student['longitude']
                for stop in stops:
                    stop_coord = stop['latitude'], stop['longitude']
                    if get_straightline_distance(*student_coord, *stop_coord) < 0.3 * LEN_OF_MILE:
                        has_inrange_stop = True
                        break
                students_response.append({"id": student['id'], "has_inrange_stop": has_inrange_stop})
            return Response(students_response, status.HTTP_200_OK)
        return Response(serializer.errors)


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly | IsSchoolStaff]
    filter_backends = [DjangoFilterBackend, DynamicSearchFilter, filters.OrderingFilter]
    filterset_fields = get_filter_dict(get_user_model())
    ordering_fields = ['email', 'full_name', 'id']
    ordering = 'id'

    def perform_destroy(self, instance):
        if is_school_staff(self.request.user):
            user_to_delete = get_user_model().objects.get(email=instance)
            if not is_guardian(user_to_delete):
                raise serializers.ValidationError("Target account to delete is privileged!")
            for student in user_to_delete.students.all():
                if student.school not in self.request.user.managed_schools.all():
                    raise serializers.ValidationError("User has a student outside of your managed schools")
        super().perform_destroy(instance)

    def get_serializer_class(self):
        if self.action == 'expose':
            return ExposeUserInputEmailSerializer
        if is_school_staff(self.request.user) and (
                self.action == 'partial_update' or self.action == 'update' or self.action == 'create'):
            return StaffEditUserSerializer
        if self.action == 'partial_update' or self.action == 'update':
            return EditUserSerializer
        if self.action == 'list' or self.action == 'retrieve':
            return FormatUserSerializer
        return UserSerializer

    def get_queryset(self):
        if is_admin(self.request.user) or is_driver(self.request.user):
            return get_user_model().objects.all().distinct().order_by('id')
        elif is_school_staff(self.request.user):
            # return get_user_model().objects.filter(id=self.request.user.id).distinct().order_by('id')
            managed_schools = self.request.user.managed_schools.all()
            students_queryset = Student.objects.none()
            for school in managed_schools:
                students_queryset = (students_queryset | school.students.all())
            return get_user_model().objects.filter(id__in=students_queryset.values('guardian_id')).distinct().order_by(
                'id')
        else:
            return get_user_model().objects.filter(id=self.request.user.id).distinct().order_by('id')

    @action(detail=False, permission_classes=[permissions.AllowAny])
    def fields(self, request):
        content = parse_repr(repr(UserSerializer()))
        return Response(content)

    @action(detail=False, methods=['post'], permission_classes=[IsAdmin | IsSchoolStaff])
    def expose(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = get_user_model().objects.get(email=serializer.validated_data["email"])
            return Response(FormatUserSerializer(user).data, status.HTTP_200_OK)
        except get_user_model().DoesNotExist:
            content = {"id": -1}
            return Response(content, status.HTTP_200_OK)


class StopViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly | IsSchoolStaff]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['route']

    def get_serializer_class(self):
        return StopSerializer

    def get_queryset(self):
        if is_admin(self.request.user) or is_driver(self.request.user):
            return Stop.objects.all()
        elif is_school_staff(self.request.user):
            managed_schools = self.request.user.managed_schools.all()
            stops_queryset = Stop.objects.none()
            for school in managed_schools:
                for route in school.routes.all():
                    stops_queryset = (stops_queryset | route.stops.all())
            return stops_queryset.distinct()
        else:
            return Stop.objects.none()


class RouteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly | IsSchoolStaff]
    filter_backends = [DjangoFilterBackend, DynamicSearchFilter, StudentCountShortCircuitFilter]
    filterset_fields = get_filter_dict(Route)
    ordering_fields = ['school__name', 'name', 'students', 'id']
    ordering = 'id'

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return FormatRouteSerializer
        return RouteSerializer

    # TODO: noticed this method is getting called twice for every actual request?
    def get_queryset(self):
        # Only return routes associated with children of current user
        if is_admin(self.request.user) or is_driver(self.request.user):
            return Route.objects.all().distinct().order_by('id')
        elif is_school_staff(self.request.user):
            managed_schools = self.request.user.managed_schools.all()
            routes_queryset = Route.objects.none()
            for school in managed_schools:
                routes_queryset = (routes_queryset | school.routes.all())
            return routes_queryset.distinct().order_by('id')
        else:
            students_queryset = self.request.user.students
            return Route.objects.filter(id__in=students_queryset.values('routes_id')).distinct().order_by('id')

    @action(detail=False, permission_classes=[permissions.AllowAny])
    def fields(self, request):
        content = parse_repr(repr(RouteSerializer()))
        return Response(content)

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def nav_link_pickup(self, request, pk=None):
        route = get_object_or_404(self.get_queryset(), pk=pk)
        return Response(navigation_link_pickup(route))

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def nav_link_dropoff(self, request, pk=None):
        route = get_object_or_404(self.get_queryset(), pk=pk)
        return Response(navigation_link_dropoff(route))


class SchoolViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSchoolStaff | IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, DynamicSearchFilter, filters.OrderingFilter]
    filterset_fields = get_filter_dict(School)
    ordering_fields = ['name', 'id', 'bus_arrival_time', 'bus_departure_time']
    ordering = 'id'

    # search_fields = [self.request.querystring]
    def get_permissions(self):
        # Remove School Staff Create/Destroy permissions
        if self.action == 'create' or self.action == 'destroy':
            return [IsAdminOrReadOnly(), ]
        return super().get_permissions()

    def get_serializer_class(self):
        if is_school_staff(self.request.user) and (self.action == 'update' or self.action == 'partial_update'):
            return StaffEditSchoolSerializer
        return SchoolSerializer

    def get_queryset(self):
        if is_admin(self.request.user) or is_driver(self.request.user):
            return School.objects.all().distinct().order_by('id')
        elif is_school_staff(self.request.user):
            return self.request.user.managed_schools.distinct().order_by('id')
        else:
            # Only return schools associated with children of current user
            students_queryset = self.request.user.students
            return School.objects.filter(id__in=students_queryset.values('school_id')).distinct().order_by('id')


class StudentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly | IsSchoolStaff]
    filter_backends = [DjangoFilterBackend, DynamicSearchFilter, filters.OrderingFilter]
    filterset_fields = get_filter_dict(Student)
    ordering_fields = ['school__name', 'student_id', 'full_name', 'id']
    ordering = 'id'

    def update(self, request, *args, **kwargs):
        super().update(request, *args, **kwargs)
        # patch already handled by initial serializer, so we allow maximum flexibility here
        serializer = FormatStudentSerializer(self.get_object(), data={}, partial=True,
                                             context=self.get_serializer_context())
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return FormatStudentSerializer
        if is_school_staff(self.request.user):
            return StaffStudentSerializer
        return StudentSerializer

    def get_queryset(self):
        # return Student.objects.all().distinct()
        if is_admin(self.request.user) or is_driver(self.request.user):
            return Student.objects.all().distinct().order_by('id')
        elif is_school_staff(self.request.user):
            managed_schools = self.request.user.managed_schools.all()
            students_queryset = Student.objects.none()
            for school in managed_schools:
                students_queryset = (students_queryset | school.students.all())
            return students_queryset.distinct().order_by('id')
        else:
            return self.request.user.students.all().distinct().order_by('id')

    # def perform_create(self, serializer):
    #     serializer.save()

    @action(detail=True, methods=['get'], permission_classes=[IsAdminOrReadOnly])
    def inrange_stops(self, request, pk=None):
        # This action assumes that pagination is always enabled
        student = get_object_or_404(self.get_queryset(), pk=pk)
        if student.routes is None:
            page = self.paginator.paginate_queryset([], request)
            return self.paginator.get_paginated_response(StopSerializer(page, many=True).data)
        student_inrange_stops = [stop for stop in student.routes.stops.all() if
                                 get_straightline_distance(student.guardian.latitude, student.guardian.longitude,
                                                           stop.latitude,
                                                           stop.longitude) < 0.3 * LEN_OF_MILE]
        page = self.paginator.paginate_queryset(student_inrange_stops, request)
        return self.paginator.get_paginated_response(StopSerializer(page, many=True).data)


# SERIALIZER UTILITIES

def populate_serializer_errors(serializer_errors: dict, data):
    """
    Populates error keys to avoid errors.

    Kludge method that populates empty errors to prevent missing key situations.  Attached to the bulk import serializer only.

    Converts {} to {"users": [{}, {}, ... , {}], "students": [{}, {}, ... , {}]}, and places remaining field checks as the
    responsibility of the calling program.

    :param serializer_errors: intended for serializer.errors dictionary
    :param data: data to obtain keys from
    """
    fields = ["users", "students"]
    for field in fields:
        if field not in serializer_errors:
            serializer_errors[field] = list()
        if len(serializer_errors[field]) == 0:
            for _ in range(len(data.get(field, []))):
                serializer_errors[field].append({})


def add_error(error_object: dict, field: str, message: str):
    if field not in error_object:
        error_object[field] = list()
    error_object[field].append(message)


class VerifyLoadedDataAPI(generics.GenericAPIView):
    serializer_class = LoadModelDataSerializer
    permission_classes = [IsAdmin | IsSchoolStaff]

    class UserRepresentation:
        def __init__(self, uuid: int, full_name: str, email: str, phone_number: str, address: str, in_db=False):
            self.uuid = f"{uuid}" if not in_db else f"indb{uuid}"
            self.full_name = full_name
            self.email = email
            self.phone_number = phone_number
            self.address = address

        def __eq__(self, other):
            return isinstance(other, self.__class__) and self.uuid == other.uuid

        def __hash__(self):
            return hash(self.uuid)

        def get_representation(self):
            return {"full_name": self.full_name, "email": self.email, "phone_number": self.phone_number,
                    "address": self.address}

    class StudentRepresentation:
        def __init__(self, usid: int, full_name: str, student_id: int, parent_email: str, school_name: str,
                     in_db=False):
            self.usid = f"{usid}" if not in_db else f"indb{usid}"
            self.full_name = full_name
            self.student_id = student_id
            self.parent_email = parent_email
            self.school_name = school_name

        def __hash__(self):
            return hash(self.usid)

        def __eq__(self, other):
            return isinstance(other, self.__class__) and self.usid == other.usid

        def get_representation(self):
            return {"full_name": self.full_name, "student_id": self.student_id, "parent_email": self.parent_email,
                    "school_name": self.school_name}

    def get_repr_of_users_with_email(self, email: str):
        matching_users = get_user_model().objects.filter(email=email)
        return [self.UserRepresentation(uuid=user.id, full_name=user.full_name, email=user.email,
                                        phone_number=user.phone_number, address=user.address, in_db=True) for user in
                matching_users]

    def get_repr_of_users_with_name(self, full_name: str):
        matching_users = get_user_model().objects.filter(full_name=full_name)
        return [self.UserRepresentation(uuid=user.id, full_name=user.full_name, email=user.email,
                                        phone_number=user.phone_number, address=user.address, in_db=True) for user in
                matching_users]

    def get_repr_of_students_with_name(self, full_name: str):
        matching_students = Student.objects.filter(full_name=full_name)
        return [
            self.StudentRepresentation(usid=student.id, full_name=student.full_name, student_id=student.school_id,
                                       parent_email=student.guardian.email,
                                       school_name=student.school.name,
                                       in_db=True) for student in matching_students]

    def get_val_field_response_format(self, value, error: list, duplicates: list):
        return {"value": value, "error": error, "duplicates": duplicates}

    def post(self, request, *args, **kwargs):
        # serializer = self.serializer_class(data=request.data)
        serializer = self.get_serializer(data=request.data)
        is_valid = serializer.is_valid()
        serializer_errors = serializer.errors
        populate_serializer_errors(serializer_errors, request.data)

        user_emails_in_student = set()
        for student in serializer.data["students"]:
            user_emails_in_student.add(student.get("parent_email", ""))

        user_email_duplication = defaultdict(set)
        user_name_duplication = defaultdict(set)
        user_representations = list()
        users_response = list()

        for user_dex, user in enumerate(serializer.data["users"]):
            email = user.get("email")
            full_name = user.get("full_name")
            representation = self.UserRepresentation(uuid=user_dex, full_name=user.get("full_name"),
                                                     email=user.get("email"), phone_number=user.get("phone_number"),
                                                     address=user.get("address"))
            user_representations.append(representation)
            user_email_duplication[email].add(representation)
            user_email_duplication[email].update(self.get_repr_of_users_with_email(email))
            user_name_duplication[full_name].add(representation)
            user_name_duplication[full_name].update(self.get_repr_of_users_with_name(full_name))
        for user_dex, user in enumerate(user_representations):
            user_object_response = dict()
            current_email_duplicates = [dup.get_representation() for dup in user_email_duplication[user.email] if
                                        dup != user]
            is_valid &= len(current_email_duplicates) == 0
            duplicate_email_address_alert = [] if len(current_email_duplicates) == 0 else [
                "Duplicate email addresses must be corrected before continuing"]
            paired_email_alert = [] if is_admin(request.user) or user.email in user_emails_in_student else [
                "This parent would be created without corresponding students"]
            user_object_response["email"] = self.get_val_field_response_format(user.email,
                                                                               serializer_errors["users"][user_dex].get(
                                                                                   "email",
                                                                                   []) + duplicate_email_address_alert + paired_email_alert,
                                                                               current_email_duplicates)
            current_name_duplicates = [dup.get_representation() for dup in user_name_duplication[user.full_name] if
                                       dup != user]
            user_object_response["full_name"] = self.get_val_field_response_format(user.full_name,
                                                                                   serializer_errors["users"][
                                                                                       user_dex].get("full_name", []),
                                                                                   current_name_duplicates)
            user_object_response["phone_number"] = self.get_val_field_response_format(user.phone_number,
                                                                                      serializer_errors["users"][
                                                                                          user_dex].get(
                                                                                          "phone_number", []), [])
            user_object_response["address"] = self.get_val_field_response_format(user.address,
                                                                                 serializer_errors["users"][
                                                                                     user_dex].get(
                                                                                     "address", []), [])
            users_response.append(user_object_response)

        student_name_duplication = defaultdict(set)
        student_representations = list()
        students_response = list()

        for student_dex, student in enumerate(serializer.data["students"]):
            full_name = student.get("full_name")
            parent_email = student.get("parent_email", "")

            if parent_email not in user_email_duplication and get_user_model().objects.filter(
                    email=parent_email).count() == 0:
                if "parent_email" not in serializer_errors["students"][student_dex]:
                    serializer_errors["students"][student_dex]["parent_email"] = list()
                serializer_errors["students"][student_dex]["parent_email"].append(
                    "Parent email does not exist in database or loaded data")

            representation = self.StudentRepresentation(usid=student_dex, full_name=student.get("full_name"),
                                                        student_id=student.get("student_id"),
                                                        parent_email=student.get("parent_email"),
                                                        school_name=student.get("school_name"))
            student_representations.append(representation)
            student_name_duplication[full_name].add(representation)
            student_name_duplication[full_name].update(self.get_repr_of_students_with_name(full_name))

        for student_dex, student in enumerate(student_representations):
            student_object_response = dict()
            current_name_duplicates = [dup.get_representation() for dup in student_name_duplication[student.full_name]
                                       if dup != student]
            student_object_response["full_name"] = self.get_val_field_response_format(student.full_name,
                                                                                      serializer_errors["students"][
                                                                                          student_dex].get(
                                                                                          "full_name", []),
                                                                                      current_name_duplicates)
            student_object_response["student_id"] = self.get_val_field_response_format(student.student_id,
                                                                                       serializer_errors["students"][
                                                                                           student_dex].get(
                                                                                           "student_id", []), [])
            student_object_response["parent_email"] = self.get_val_field_response_format(student.parent_email,
                                                                                         serializer_errors[
                                                                                             "students"][
                                                                                             student_dex].get(
                                                                                             "parent_email", []), [])
            student_object_response["school_name"] = self.get_val_field_response_format(student.school_name,
                                                                                        serializer_errors["students"][
                                                                                            student_dex].get(
                                                                                            "school_name", []), [])
            students_response.append(student_object_response)
        return Response({"users": users_response, "students": students_response}, status.HTTP_200_OK)


class SubmitLoadedDataAPI(generics.GenericAPIView):
    serializer_class = LoadModelDataSerializer
    permission_classes = [IsAdmin | IsSchoolStaff]

    def post(self, request, *args, **kwargs):
        # geolocator = Nominatim(user_agent="bulk data importer")
        geolocator = GoogleV3(api_key="AIzaSyDsyPs-pIVKGJiy7EVy8aKebN5zg515BCs")
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid()
        # print('SERIALIZER VALIDATED DATA:', serializer.validated_data)

        # serializer_errors = serializer.errors
        # populate_serializer_errors(serializer_errors, request.data)
        user_errors = list()
        student_errors = list()
        rollback_at_end = False
        try:
            with transaction.atomic():
                for user_dex, user_data in enumerate(serializer.data["users"]):
                    user_serializer = LoadUserSerializer(data=user_data, context={'request': request})
                    if user_serializer.is_valid():
                        location = geolocator.geocode(user_data["address"])
                        user = get_user_model().objects.create_verified_user(**user_data, latitude=location.latitude,
                                                                             longitude=location.longitude,
                                                                             password="DUMMY_PASSWORD")
                        user.set_unusable_password()
                        user.groups.add(Group.objects.get(name="Guardian"))
                    else:
                        rollback_at_end = True
                    user_errors.append(user_serializer.errors)
                for student_dex, student_data in enumerate(serializer.data["students"]):
                    student_serializer = LoadStudentSerializerStrict(data=student_data, context={'request': request})
                    if student_serializer.is_valid():
                        candidates = find_school_match_candidates(student_data["school_name"])
                        school = None
                        for candidate in candidates:
                            if school_names_match(candidate.name, student_data["school_name"]):
                                school = candidate
                                break
                        guardian = get_user_model().objects.get(email=student_data["parent_email"])
                        student = Student.objects.create(full_name=student_data["full_name"], active=True,
                                                         school=school,
                                                         guardian=guardian, routes=None,
                                                         student_id=student_data["student_id"])
                    else:
                        rollback_at_end = True
                    student_errors.append(student_serializer.errors)
                if rollback_at_end:
                    raise serializers.ValidationError("Generic validation error")
        except serializers.ValidationError:
            context = {
                "users": user_errors,
                "students": student_errors
            }
            return Response(context, status=status.HTTP_400_BAD_REQUEST)

        content = {"num_users": len(serializer.data["users"]),
                   "num_students": len(serializer.data["students"])}
        return Response(content, status=status.HTTP_201_CREATED)
