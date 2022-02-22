from urllib import response
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status
from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
import requests, json
import os
from datetime import time, datetime

from .models import School, Route, Student, Stop
from .serializers import UserSerializer, StudentSerializer, RouteSerializer, SchoolSerializer, FormatStudentSerializer, \
    FormatRouteSerializer, FormatUserSerializer, EditUserSerializer, StopSerializer, CheckInrangeSerializer
from .search import DynamicSearchFilter
from .customfilters import StudentCountShortCircuitFilter
from .permissions import is_admin, IsAdminOrReadOnly, IsAdmin
from django.shortcuts import get_object_or_404
from .geo_utils import get_straightline_distance, LEN_OF_MILE

os.environ['DISTANCE_MATRIX_API_URL']='https://maps.googleapis.com/maps/api/distancematrix/json'
os.environ['DISTANCE_MATRIX_API_KEY']='AIzaSyAs_8cqVS3l_q4lxKLiTgyrjRCN8aWN28g'


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
    return date.hour*3600 + date.minute*60 + date.second


def sec_to_datetime_h_m_s(seconds: int) -> datetime:
    """
    Change some integer into a datetime object in format HH:MM:SS
    :param seconds: seconds
    :return: datetime object
    """
    h = seconds//3600
    m = (seconds%3600)//60
    s = seconds%60
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
    matrix = school.address

    # here's the perhaps risky business. we order by stop number, and hope for the best
    stops = Stop.objects.filter(route=route).distinct().order_by('stop_number')
    for stop in stops:
        matrix = matrix + f'|{stop.latitude}, {stop.longitude}'

    times = distance_matrix_api(matrix)
    # print(times)
    return school_start_time, school_letout_time, stops, times

def update_bus_times_for_stops_related_to_stop(stop: Stop):
    """
    Given some stop, calculate and update the dropoff and pickup times between each stop 
    on the related route, given some order determined by the states
    :param stop: valid Stop object
    :return: datetime[], datetime[], Stop[] -> list of dropoff times, list of pickup times, and list of corresponding stops
    """
    school_start_time, school_letout_time, stops, times = get_information_related_to_a_stop(stop)
    school_to_stop_1 = times['rows'][0]['elements'][1]['duration']['value']
    stop_n_to_school = times['rows'][len(stops)-1]['elements'][0]['duration']['value']

    # setup, handle the edge case of leaving the school
    desc_times, asc_times = [], [school_to_stop_1]
    running_desc_time, running_asc_time = 0, school_to_stop_1
    
    for stop_num in range(1, min(25, (len(stops)))):
        prev_stop = times['rows'][stop_num]['elements'][stop_num-1]['duration']['value']
        running_desc_time = running_desc_time + prev_stop # this is stop i to stop i-1
        desc_times.append(running_desc_time)

        next_stop = times['rows'][stop_num]['elements'][stop_num+1]['duration']['value']
        running_asc_time = running_asc_time + next_stop # this is stop i to stop i+1
        asc_times.append(running_asc_time)   

    # handle the edge case of arriving to the school
    if len(stops)==1:
        running_desc_time = times['rows'][1]['elements'][0]['duration']['value']
    else:
        running_desc_time = running_desc_time + stop_n_to_school
    desc_times.append(running_desc_time)
    dropoff_times = [sec_to_datetime_h_m_s((school_letout_time+time)%(24*3600)) for time in asc_times]
    pickup_times = [sec_to_datetime_h_m_s((school_start_time+time-running_desc_time-stop_n_to_school)%(24*3600)) for time in desc_times]
    stop_num = 0
    # print(stops)
    for stop in stops:
        stop.pickup_time=pickup_times[stop_num]
        stop.dropoff_time=dropoff_times[stop_num]
        # print(f"internal stop_name: {stop.name}, dropoff time:{stop.dropoff_time}, pickup time:{stop.pickup_time}, long{stop.longitude} lat{stop.latitude}")
        stop.save(update_fields=['pickup_time', 'dropoff_time'])
        stop_num = stop_num+1
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
                    if get_straightline_distance(*student_coord, *stop_coord) < 0.75 * LEN_OF_MILE:
                        has_inrange_stop = True
                        break
                students_response.append({"id": student['id'], "has_inrange_stop": has_inrange_stop})
            return Response(students_response, status.HTTP_200_OK)
        return Response(serializer.errors)


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [
        # permissions.IsAuthenticated
        IsAdminOrReadOnly
    ]
    filter_backends = [DjangoFilterBackend, DynamicSearchFilter, filters.OrderingFilter]
    filterset_fields = get_filter_dict(get_user_model())
    ordering_fields = ['email', 'full_name', 'id']
    ordering = 'id'

    def get_serializer_class(self):
        if self.action == 'partial_update' or self.action == 'update':
            return EditUserSerializer
        if self.action == 'list' or self.action == 'retrieve':
            return FormatUserSerializer
        return UserSerializer

    def get_queryset(self):
        if is_admin(self.request.user):
            return get_user_model().objects.all().distinct().order_by('id')
        else:
            return get_user_model().objects.filter(id=self.request.user.id).distinct().order_by('id')

    @action(detail=False, permission_classes=[permissions.AllowAny])
    def fields(self, request):
        content = parse_repr(repr(UserSerializer()))
        return Response(content)


class StopViewSet(viewsets.ModelViewSet):
    permission_classes = [
        IsAdmin
    ]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['route']

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['route']

    # @override
    # def create(self, request):
    #     res = self.create()
    #     stop = self.get_object()
    #     print(f'stop: {stop}\n')
    # #     update_bus_times_for_stops_related_to_stop(stop)
    #     content = parse_repr(repr(StopSerializer()))
    #     return Response(content)


    def get_serializer_class(self):
        return StopSerializer

    def get_queryset(self):
        return Stop.objects.all()

    # @action(detail=False, permission_classes=[permissions.AllowAny])
    # def fields(self, request):
    #     content = parse_repr(repr(StopSerializer()))
    #     return Response(content)


class RouteViewSet(viewsets.ModelViewSet):
    permission_classes = [
        IsAdminOrReadOnly
        # permissions.IsAuthenticated
    ]
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
        if is_admin(self.request.user):
            return Route.objects.all().distinct().order_by('id')
        else:
            students_queryset = self.request.user.students
            return Route.objects.filter(id__in=students_queryset.values('routes_id')).distinct().order_by('id')
            # return Route.objects.all().distinct()

    @action(detail=False, permission_classes=[permissions.AllowAny])
    def fields(self, request):
        content = parse_repr(repr(RouteSerializer()))
        return Response(content)


class SchoolViewSet(viewsets.ModelViewSet):
    serializer_class = SchoolSerializer
    permission_classes = [
        # permissions.IsAuthenticated
        IsAdminOrReadOnly
    ]
    filter_backends = [DjangoFilterBackend, DynamicSearchFilter, filters.OrderingFilter]
    filterset_fields = get_filter_dict(School)
    ordering_fields = ['name', 'id', 'bus_arrival_time', 'bus_departure_time']
    ordering = 'id'

    # search_fields = [self.request.querystring]

    def get_queryset(self):
        if is_admin(self.request.user):
            return School.objects.all().distinct().order_by('id')
        else:
            # Only return schools associated with children of current user
            students_queryset = self.request.user.students
            return School.objects.filter(id__in=students_queryset.values('school_id')).distinct().order_by('id')

    @action(detail=False, permission_classes=[permissions.AllowAny])
    def fields(self, request):
        content = parse_repr(repr(SchoolSerializer()))
        return Response(content)


class StudentViewSet(viewsets.ModelViewSet):
    permission_classes = [
        # permissions.IsAuthenticated
        # permissions.AllowAny
        IsAdminOrReadOnly
    ]
    filter_backends = [DjangoFilterBackend, DynamicSearchFilter, filters.OrderingFilter]
    filterset_fields = get_filter_dict(Student)
    ordering_fields = ['school__name', 'student_id', 'full_name', 'id']
    ordering = 'id'

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return FormatStudentSerializer
        return StudentSerializer

    def get_queryset(self):
        # return Student.objects.all().distinct()
        if is_admin(self.request.user):
            return Student.objects.all().distinct().order_by('id')
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
                                                           stop.longitude) < 0.75 * LEN_OF_MILE]
        page = self.paginator.paginate_queryset(student_inrange_stops, request)
        return self.paginator.get_paginated_response(StopSerializer(page, many=True).data)

    @action(detail=False, permission_classes=[permissions.AllowAny])
    def fields(self, request):
        content = parse_repr(repr(StudentSerializer()))
        return Response(content)
