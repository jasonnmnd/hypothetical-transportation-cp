import requests, json
from django.contrib.auth import get_user_model
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, serializers
from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import datetime, time
from geopy.geocoders import GoogleV3
from .models import School, Route, Student, Stop, TransitLog, BusRun, Bus
from .serializers import StartBusRunSerializer, UserSerializer, StudentSerializer, RouteSerializer, SchoolSerializer, FormatStudentSerializer, \
    FormatRouteSerializer, FormatUserSerializer, EditUserSerializer, StopSerializer, CheckInrangeSerializer, \
    LoadUserSerializer, LoadModelDataSerializer, find_school_match_candidates, school_names_match, \
    StaffEditUserSerializer, StaffEditSchoolSerializer, StaffStudentSerializer, LoadStudentSerializer, \
    LoadStudentSerializerStrict, ExposeUserSerializer, ExposeUserInputEmailSerializer, BusSerializer, \
    TransitLogSerializer, BusRunSerializer, FormatBusRunSerializer, BusSerializer
from .search import DynamicSearchFilter
from .customfilters import StudentCountShortCircuitFilter
from .permissions import is_admin, is_school_staff, is_driver, IsAdminOrReadOnly, IsAdmin, IsSchoolStaff, is_guardian, \
    is_student
from django.shortcuts import get_object_or_404
from .geo_utils import get_straightline_distance, LEN_OF_MILE
from .nav_utils import navigation_link_dropoff, navigation_link_pickup
from collections import defaultdict
from django.contrib.auth.models import Group
from .student_account_managers import send_invite_email
from .custom_geocoder import CachedGoogleV3


BUS_RUN_TIMEOUT_THRESHOLD = 3*3600



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


def duration_check_multiple(active_runs):
    for run in active_runs:
        duration_check(run)

def duration_check(run: BusRun):
    if run.duration is None or run.duration.hour < 3:
        t = time_now()
        time_in_sec = t.hour*3600 + t.minute*60 + t.second
        start_time_in_sec = run.start_time.hour*3600 + run.start_time.minute*60 + run.start_time.second
        delta = time_in_sec-start_time_in_sec
            # print(delta)
        if delta > BUS_RUN_TIMEOUT_THRESHOLD or delta<0:
            # HASTAG HACKINNGGGGGGGG
            new_hour = (run.start_time.hour+3)%24
            if run.start_time.hour >=21:
                new_day=run.start_time.day+1
            else:
                new_day = run.start_time.day
                # print(new_hour)
            run.end_time = datetime(
                run.start_time.year,
                run.start_time.month,
                new_day,
                new_hour, 
                run.start_time.minute,
                run.start_time.second
            )
                # print(delta//3600)
            run.duration = time(3, 0, 0)
            run.timeout = True
        # else:
            # run.duration = time(delta//3600, (delta%3600)//60, delta%60)
            # run.timeout = False
            run.save(update_fields=['end_time', 'duration', 'timeout'])
        # TODO delete bus from bus table


def get_active_bus_for_bus_number(bus_number):
    duration_check(BusRun.objects.filter(bus_number=bus_number, end_time=None).distinct()[0])
    return BusRun.objects.filter(bus_number=bus_number, end_time=None).distinct()[0]


def get_active_bus_for_route(route):
    duration_check(BusRun.objects.filter(route=route, end_time=None).distinct()[0])
    return BusRun.objects.filter(route=route, end_time=None).distinct()[0]


def get_active_bus_for_driver(driver):
    duration_check(BusRun.objects.filter(driver=driver, end_time=None).distinct()[0])
    return BusRun.objects.filter(driver=driver, end_time=None).distinct()[0]


def get_active_bus_on_route_from_pk(route_id):
    route = Route.objects.filter(id=route_id).distinct()[0]
    duration_check(BusRun.objects.filter(route=route, end_time=None).distinct()[0])
    return BusRun.objects.filter(route=route, end_time=None).distinct()[0]


def get_active_bus_for_driver_from_pk(driver_id):
    driver = get_user_model().objects.filter(id=driver_id)[0]
    duration_check(BusRun.objects.filter(driver=driver, end_time=None).distinct()[0])
    return BusRun.objects.filter(driver=driver, end_time=None).distinct()[0]


def count_active_run_for_bus_number(bus_number) -> int:
    duration_check_multiple(BusRun.objects.filter(bus_number=bus_number, end_time=None))
    return len(BusRun.objects.filter(bus_number=bus_number, end_time=None))


def count_active_run_for_route(route) -> int:
    duration_check_multiple(BusRun.objects.filter(route=route, end_time=None))
    return len(BusRun.objects.filter(route=route, end_time=None))


def count_active_run_for_driver(driver) -> int:
    duration_check_multiple(BusRun.objects.filter(driver=driver, end_time=None))
    return len(BusRun.objects.filter(driver=driver, end_time=None))


def time_now():
    date = datetime.now()
    return date


def end_run_now(run: BusRun):
    t = time_now()
    run.end_time = t
    end_time_in_sec = run.end_time.hour*3600 + run.end_time.minute*60 + run.end_time.second
    start_time_in_sec = run.start_time.hour*3600 + run.start_time.minute*60 + run.start_time.second
    delta = end_time_in_sec-start_time_in_sec
    run.duration = time(delta//3600, (delta%3600)//60, delta%60)
    run.save(update_fields=['end_time', 'duration'])

    run.route.driver = None
    run.route.bus_number = None
    run.route.save(update_fields=['driver', 'bus_number'])

    Bus.objects.filter(bus_number=run.bus_number).delete()

    return Response(FormatBusRunSerializer(instance=run).data, status.HTTP_200_OK)


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


class StartBusRunAPI(generics.GenericAPIView):
    # serializer_class = BusRunSerializer
    serializer_class = StartBusRunSerializer
    permission_classes = [
        permissions.AllowAny
    ]

    # def post(self, request, *args, **kwargs):
    def post(self, request):
        data = {}
        data['start_time'] = time_now()
        data['bus_number'] = request.data['bus_number']
        if request.data.get('force'):
            data['force'] = request.data['force']
        else:
            data['force'] = False

        if count_active_run_for_bus_number(request.data['bus_number']) is not 0:
            if not data['force']:
                return Response("Bus is already active on another route", status.HTTP_409_CONFLICT)
            run = get_active_bus_for_bus_number(request.data['bus_number'])
            end_run_now(run)
        
        data['route'] = request.data['route']
        if count_active_run_for_route(request.data['route']) is not 0:
            if not data['force']:
                return Response("Route already has an active run", status.HTTP_409_CONFLICT)
            run = get_active_bus_for_route(request.data['route'])
            end_run_now(run)

        data['school'] = Route.objects.filter(id=request.data['route']).distinct()[0].school.id

        data['driver'] = request.data['driver']
        # data['driver'] = UserSerializer(instance=get_user_model().objects.filter(id=request.data['driver']).distinct()[0]).data
        
        if count_active_run_for_driver(request.data['driver']) is not 0:
            if not data['force']:
                return Response("Driver is already active on a run", status.HTTP_409_CONFLICT)
            run = get_active_bus_for_driver(request.data['driver'])
            end_run_now(run)
        
        if request.data.get('going_towards_school'):
            data['going_towards_school'] = request.data['going_towards_school']
        else:
            data['going_towards_school'] = False

        serializer = BusRunSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors)

        # data['driver'] = UserSerializer(instance=get_user_model().objects.filter(id=request.data['driver']).distinct()[0]).data
        run = BusRun.objects.filter(id=serializer.data['id']).distinct()[0]
        
        run.route.driver = run.driver
        run.route.bus_number = run.bus_number
        run.route.save(update_fields=['driver', 'bus_number'])
        return Response(FormatBusRunSerializer(instance=run).data, status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly | IsSchoolStaff]
    filter_backends = [DjangoFilterBackend, DynamicSearchFilter, filters.OrderingFilter]
    filterset_fields = get_filter_dict(get_user_model())
    ordering_fields = ['email', 'full_name', 'id']
    ordering = 'full_name'

    def perform_destroy(self, instance):
        if is_school_staff(self.request.user):
            user_to_delete = get_user_model().objects.get(email=instance)
            if is_student(
                    user_to_delete) and user_to_delete.linked_student.school not in self.request.user.managed_schools.all():
                raise serializers.ValidationError("Target student login account is outside of your managed schools")
            if not is_guardian(user_to_delete) and not is_student(user_to_delete):
                raise serializers.ValidationError("Target account to delete is privileged!")
            # Won't be checked anymore due to exclusion of privileged accounts and students
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
            return get_user_model().objects.all().distinct().order_by('full_name')
        elif is_school_staff(self.request.user):
            # return get_user_model().objects.filter(id=self.request.user.id).distinct().order_by('id')
            managed_schools = self.request.user.managed_schools.all()
            students_queryset = Student.objects.none()
            for school in managed_schools:
                students_queryset = (students_queryset | school.students.all())
            return get_user_model().objects.filter(id__in=students_queryset.values('guardian_id')).distinct().order_by(
                'full_name')
        else:
            # Students and Parents can only see themselves
            return get_user_model().objects.filter(id=self.request.user.id).distinct().order_by('full_name')

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
            # Parent and Student view slices of stops are based on the action within student
            return Stop.objects.none()


class ActiveBusRunViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly | IsSchoolStaff]
    filter_backends = [DjangoFilterBackend, DynamicSearchFilter, filters.OrderingFilter]
    
    # filterset_fields = get_filter_dict(BusRun)
    filterset_fields = ['bus_number', 'driver', 'route', 'school']
    ordering_fields = ['bus_number', 'driver', 'start_time', 'route', 'going_towards_school']
    ordering = 'start_time'

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return FormatBusRunSerializer
        if is_school_staff(self.request.user):
            return FormatBusRunSerializer
        return BusRunSerializer
    
    def get_queryset(self):
        duration_check_multiple(BusRun.objects.filter(end_time=None).distinct().order_by('start_time'))
        if is_school_staff(self.request.user):
            return BusRun.objects.filter(id__in=self.request.user.managed_schools.distinct().values('run_id'), end_time=None).distinct().order_by('start_time')
        return BusRun.objects.filter(end_time=None).distinct().order_by('start_time')


class RouteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly | IsSchoolStaff]
    filter_backends = [DjangoFilterBackend, DynamicSearchFilter, StudentCountShortCircuitFilter]
    filterset_fields = get_filter_dict(Route)
    ordering_fields = ['school__name', 'name', 'students', 'id']
    ordering = 'name'

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return FormatRouteSerializer
        return RouteSerializer

    # TODO: noticed this method is getting called twice for every actual request?
    def get_queryset(self):
        # Only return routes associated with children of current user
        if is_admin(self.request.user) or is_driver(self.request.user):
            return Route.objects.all().distinct().order_by('name')
        elif is_school_staff(self.request.user):
            managed_schools = self.request.user.managed_schools.all()
            routes_queryset = Route.objects.none()
            for school in managed_schools:
                routes_queryset = (routes_queryset | school.routes.all())
            return routes_queryset.distinct().order_by('name')
        elif is_student(self.request.user):
            student_route = self.request.user.linked_student.routes
            route_id = None if not student_route else student_route.id
            return Route.objects.filter(id=route_id).distinct().order_by('name')
        else:
            students_queryset = self.request.user.students
            return Route.objects.filter(id__in=students_queryset.values('routes_id')).distinct().order_by('name')

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


class BusRunViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly | IsSchoolStaff]
    filter_backends = [DjangoFilterBackend, DynamicSearchFilter, filters.OrderingFilter]
    
    # filterset_fields = get_filter_dict(BusRun)
    filterset_fields = ['bus_number', 'driver', 'route', 'school__name']
    ordering_fields = ['bus_number', 'driver', 'start_time', 'route', 'going_towards_school', 'duration', 'school__name']
    ordering = ['start_time', 'duration']

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return FormatBusRunSerializer
        if is_school_staff(self.request.user):
            return FormatBusRunSerializer
        return BusRunSerializer
    
    def get_queryset(self):
        if is_school_staff(self.request.user):
            return BusRun.objects.filter(id__in=self.request.user.managed_schools.distinct().values('run_id')).distinct().order_by('-start_time')
        return BusRun.objects.all().distinct().order_by('bus_number')

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def next_stop(self, request, pk):
        try:
            run = get_active_bus_on_route_from_pk(pk)
            try:
                # reason the index doesn't make sense: we don't store stop 0, which is the school
                if run.going_towards_school:
                    next_stop = Stop.objects.filter(route=run.route).order_by('-stop_number')[run.previous_stop_index]
                else:
                    if run.previous_stop_index == len(Stop.objects.filter(route=run.route))-1:
                        return Response("Current stop is the second to last stop on the route", status.HTTP_200_OK)
                    next_stop = Stop.objects.filter(route=run.route).order_by('stop_number')[run.previous_stop_index]
                return Response(StopSerializer(instance=next_stop).data, status.HTTP_200_OK)
            except:
                return Response("There are no more stops on this route", status.HTTP_404_NOT_FOUND)
        except:
            return Response("This run no longer exists", status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post', 'get'], permission_classes=[permissions.AllowAny]) # this is sus. a get that updates...
    def reached_next_stop(self, request, pk):
        try:
            run = get_active_bus_on_route_from_pk(pk) 
            run.previous_stop_index = run.previous_stop_index+1
            if len(Stop.objects.filter(route=run.route)) != run.previous_stop_index:
                run.save(update_fields=['previous_stop_index'])
                return self.next_stop(self, pk=pk)
                # return Response(FormatBusRunSerializer(instance=run).data, status.HTTP_204_NO_CONTENT)
            # return end_run_now(run)
            return Response("There are no more stops to reach on this route", status.HTTP_200_OK)
        except:
            return Response("This run is no longer active", status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post', 'get'], permission_classes=[permissions.AllowAny]) # this is sus. a get that updates...
    def end_run(self, request, pk):
        try:
            run = get_active_bus_on_route_from_pk(pk)
            return end_run_now(run)
        except:
            return Response("There is no active bus on this route", status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def driver(self, request, pk):
        try:
            run = get_active_bus_for_driver_from_pk(pk)
            return Response(FormatBusRunSerializer(instance=run).data, status.HTTP_200_OK)
        except:
            return Response("There is no active bus for this driver", status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def route(self, request, pk):
        try:
            run = get_active_bus_on_route_from_pk(pk)
            return Response(FormatBusRunSerializer(instance=run).data, status.HTTP_200_OK)
        except:
            return Response("There is no active bus for this driver", status.HTTP_404_NOT_FOUND)


class ActiveBusLocationsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, DynamicSearchFilter, filters.OrderingFilter]
    
    filterset_fields = get_filter_dict(Bus)
    ordering = 'bus_number'

    def get_serializer_class(self):
        return BusSerializer
    
    def get_queryset(self):
        # if is_school_staff(self.request.user):
            # return Bus.objects.filter(id__in=self.request.user.managed_schools.distinct().values('run_id')).distinct().order_by('start_time')
        return Bus.objects.all().distinct().order_by('bus_number')


class TranzitTraqApi(generics.GenericAPIView):

    def talk_to_tranzit_traq(self, bus) -> Response:
        try:
            url =  f"http://tranzit.colab.duke.edu:8000/get"
            params = {'bus': bus.bus_number}
            req = requests.get(url=url, params=params)
            ret = json.loads(req.text)
            # return Response(ret, status.HTTP_200_OK)
            data = {}
            try:
                bus_object = Bus.objects.get(bus_number=bus.bus_number)
                bus_object.latitude = ret['lat']
                bus_object.longitude = ret['lng']
                bus_object.save(update_fields=['latitude', 'longitude'])
                bus
            except:
                data['bus_number'] = ret['bus']
                data['latitude'] = ret['lat']
                data['longitude'] = ret['lng']
                serializer = BusSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
            bus.location = Bus.objects.get(bus_number=bus.bus_number)
            bus.save(update_fields=['location'])
            
        except:
            return Response("Tranzit Traq gave a poor response", status.HTTP_404_NOT_FOUND)

    def get(self, request, *args, **kwargs):
        active_buses = BusRun.objects.filter(end_time=None)
        counter = 0
        for bus in active_buses:
            # bus_id=request.GET['bus']
            duration_check(bus)
            if bus.end_time is None and counter < 100:
                self.talk_to_tranzit_traq(bus)
                counter += 1
        return Response("done", status.HTTP_200_OK)



class SchoolViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSchoolStaff | IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, DynamicSearchFilter, filters.OrderingFilter]
    filterset_fields = get_filter_dict(School)
    ordering_fields = ['name', 'id', 'bus_arrival_time', 'bus_departure_time']
    ordering = 'name'

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
            return School.objects.all().distinct().order_by('name')
        elif is_school_staff(self.request.user):
            return self.request.user.managed_schools.distinct().order_by('name')
        elif is_student(self.request.user):
            return School.objects.none()
        else:
            # Only return schools associated with children of current user
            students_queryset = self.request.user.students
            return School.objects.filter(id__in=students_queryset.values('school_id')).distinct().order_by('name')


class StudentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly | IsSchoolStaff]
    filter_backends = [DjangoFilterBackend, DynamicSearchFilter, filters.OrderingFilter]
    filterset_fields = get_filter_dict(Student)
    ordering_fields = ['school__name', 'student_id', 'full_name', 'id', 'email']
    ordering = 'full_name'

    def update(self, request, *args, **kwargs):
        super().update(request, *args, **kwargs)
        # print(request.data)
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
            return Student.objects.all().distinct().order_by('full_name')
        elif is_school_staff(self.request.user):
            managed_schools = self.request.user.managed_schools.all()
            students_queryset = Student.objects.none()
            for school in managed_schools:
                students_queryset = (students_queryset | school.students.all())
            return students_queryset.distinct().order_by('full_name')
        elif is_student(self.request.user):
            linked_student_id = self.request.user.linked_student.id
            return Student.objects.filter(id=linked_student_id).distinct().order_by('full_name')
        else:
            return self.request.user.students.all().distinct().order_by('full_name')

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
        def __init__(self, uuid: str, full_name: str, email: str, phone_number: str, address: str, in_db=False):
            self.uuid = f"{uuid}" if not in_db else f"indb{uuid}"
            self.full_name = full_name
            self.email = email
            self.phone_number = phone_number
            self.address = address
            self.in_db = in_db

        def __eq__(self, other):
            return isinstance(other, self.__class__) and self.uuid == other.uuid

        def __hash__(self):
            return hash(self.uuid)

        def get_representation(self):
            return {"full_name": self.full_name, "email": self.email, "phone_number": self.phone_number,
                    "address": self.address}

    class StudentRepresentation:
        def __init__(self, usid: str, email: str, phone_number: str, full_name: str, student_id: int, parent_email: str,
                     school_name: str,
                     in_db=False):
            self.usid = f"{usid}" if not in_db else f"indb{usid}"
            self.email = email
            self.phone_number = phone_number
            self.full_name = full_name
            self.student_id = student_id
            self.parent_email = parent_email
            self.school_name = school_name
            self.in_db = in_db

        def __hash__(self):
            return hash(self.usid)

        def __eq__(self, other):
            return isinstance(other, self.__class__) and self.usid == other.usid

        def get_representation(self):
            return {"email": self.email, "phone_number": self.phone_number, "full_name": self.full_name,
                    "student_id": self.student_id, "parent_email": self.parent_email, "school_name": self.school_name}

    def student_to_user(self, student: StudentRepresentation):
        address_msg = "Student role does not have address"
        return self.UserRepresentation(uuid=f"from_student_{student.usid}", full_name=student.full_name,
                                       email=student.email,
                                       phone_number=student.phone_number, address=address_msg, in_db=student.in_db)

    def user_to_student(self, user: UserRepresentation):
        # student_id_msg = "Not required for system users"
        school_name_msg = "Not required for system users"
        return self.StudentRepresentation(usid=f"from_user_{user.uuid}", email=user.email,
                                          phone_number=user.phone_number, full_name=user.full_name,
                                          student_id=-1,
                                          parent_email="", school_name=school_name_msg)

    def get_repr_of_users_with_email(self, email: str):
        matching_users = get_user_model().objects.filter(email=email)
        return [self.UserRepresentation(uuid=str(user.id), full_name=user.full_name, email=user.email,
                                        phone_number=user.phone_number, address=user.address, in_db=True) for user in
                matching_users]

    def get_repr_of_users_with_name(self, full_name: str):
        matching_users = get_user_model().objects.filter(full_name=full_name)
        return [self.UserRepresentation(uuid=str(user.id), full_name=user.full_name, email=user.email,
                                        phone_number=user.phone_number, address=user.address, in_db=True) for user in
                matching_users]

    def get_repr_of_students_with_email(self, email: str):
        matching_students = Student.objects.filter(email=email)
        return [
            self.StudentRepresentation(usid=str(student.id), email=student.email, phone_number=student.phone_number,
                                       full_name=student.full_name, student_id=student.school_id,
                                       parent_email=student.guardian.email, school_name=student.school.name,
                                       in_db=True) for student in matching_students]

    def get_repr_of_students_with_name(self, full_name: str):
        matching_students = Student.objects.filter(full_name=full_name)
        return [
            self.StudentRepresentation(usid=str(student.id), email=student.email, phone_number=student.phone_number,
                                       full_name=student.full_name, student_id=student.school_id,
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
            user_email = user.get("email")
            full_name = user.get("full_name")
            representation = self.UserRepresentation(uuid=str(user_dex), full_name=user.get("full_name"),
                                                     email=user.get("email"), phone_number=user.get("phone_number"),
                                                     address=user.get("address"))
            user_representations.append(representation)
            user_email_duplication[user_email].add(representation)
            user_email_duplication[user_email].update(self.get_repr_of_users_with_email(user_email))
            user_name_duplication[full_name].add(representation)
            user_name_duplication[full_name].update(self.get_repr_of_users_with_name(full_name))

        student_email_duplication = defaultdict(set)
        student_name_duplication = defaultdict(set)
        student_representations = list()
        students_response = list()

        for student_dex, student in enumerate(serializer.data["students"]):
            full_name = student.get("full_name")
            parent_email = student.get("parent_email", "")
            student_email = student.get("email")

            if parent_email not in user_email_duplication and get_user_model().objects.filter(
                    email=parent_email).count() == 0:
                if "parent_email" not in serializer_errors["students"][student_dex]:
                    serializer_errors["students"][student_dex]["parent_email"] = list()
                serializer_errors["students"][student_dex]["parent_email"].append(
                    "Parent email does not exist in database or loaded data")

            representation = self.StudentRepresentation(usid=str(student_dex), email=student.get("email"),
                                                        phone_number=student.get("phone_number"),
                                                        full_name=student.get("full_name"),
                                                        student_id=student.get("student_id"),
                                                        parent_email=student.get("parent_email"),
                                                        school_name=student.get("school_name"))
            student_representations.append(representation)

            # Check ensures that duplication warnings do not occur for students with no intention of setting up a user account
            if student_email is not None and student_email != "":
                student_email_duplication[student_email].add(representation)
                student_email_duplication[student_email].update(self.get_repr_of_students_with_email(student_email))
            student_name_duplication[full_name].add(representation)
            student_name_duplication[full_name].update(self.get_repr_of_students_with_name(full_name))

        for user_dex, user in enumerate(user_representations):
            user_object_response = dict()

            # Duplicates should contain both other users in the database and any students that could conflict
            current_user_email_duplicates = [dup.get_representation() for dup in user_email_duplication[user.email] if
                                             dup != user]
            if len(student_email_duplication[user.email]) > 0:
                current_user_email_duplicates.extend(
                    [self.student_to_user(student).get_representation() for student in
                     student_email_duplication[user.email]])
            is_valid &= len(current_user_email_duplicates) == 0
            user_email_errors = serializer_errors["users"][user_dex].get("email", [])

            if len(current_user_email_duplicates) != 0:
                user_email_errors.append("Duplicate email addresses must be corrected before continuing")
            if not is_admin(request.user) and user.email not in user_emails_in_student:
                # Due to variance request, school staff must create parents paired with students or result in disappearing guardians
                user_email_errors.append("This parent would be created without corresponding students")
            if user.email in student_email_duplication and len(student_email_duplication[user.email]) > 0:
                user_email_errors.append(
                    "This email conflicts with a student email that would be loaded as part of this transaction")

            user_object_response["email"] = self.get_val_field_response_format(user.email, user_email_errors,
                                                                               current_user_email_duplicates)
            current_name_duplicates = [dup.get_representation() for dup in user_name_duplication[user.full_name] if
                                       dup != user]
            current_name_duplicates.extend(
                [self.student_to_user(student).get_representation() for student in
                 student_name_duplication[user.full_name]])

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

        for student_dex, student in enumerate(student_representations):
            student_object_response = dict()
            current_student_email_duplicates = [dup.get_representation() for dup in
                                                student_email_duplication[student.email] if
                                                dup != student]

            if len(user_email_duplication[student.email]) > 0:
                current_student_email_duplicates.extend(
                    [self.user_to_student(user).get_representation() for user in user_email_duplication[student.email]])
            else:
                # Do a database search due to missed hit
                current_student_email_duplicates.extend(
                    [self.user_to_student(user).get_representation() for user in
                     self.get_repr_of_users_with_email(student.email)])

            student_email_errors = serializer_errors["students"][student_dex].get("email", [])

            if len(current_student_email_duplicates) != 0:
                student_email_errors.append("Duplicate email addresses must be corrected before continuing")

            if student.email in user_email_duplication and len(user_email_duplication[student.email]) > 0:
                student_email_errors.append(
                    "This email conflicts with a user email that would be loaded as part of this transaction")

            current_name_duplicates = [dup.get_representation() for dup in student_name_duplication[student.full_name]
                                       if dup != student]
            current_name_duplicates.extend(
                [self.user_to_student(user).get_representation() for user in user_name_duplication[student.full_name]])

            student_object_response["email"] = self.get_val_field_response_format(student.email,
                                                                                  student_email_errors,
                                                                                  current_student_email_duplicates)
            student_object_response["phone_number"] = self.get_val_field_response_format(student.phone_number,
                                                                                         serializer_errors[
                                                                                             "students"][
                                                                                             student_dex].get(
                                                                                             "phone_number", []), [])
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
        # print(student_email_duplication)
        return Response({"users": users_response, "students": students_response}, status.HTTP_200_OK)


class SubmitLoadedDataAPI(generics.GenericAPIView):
    serializer_class = LoadModelDataSerializer
    permission_classes = [IsAdmin | IsSchoolStaff]

    def post(self, request, *args, **kwargs):
        # geolocator = Nominatim(user_agent="bulk data importer")
        geolocator = CachedGoogleV3(api_key="AIzaSyDsyPs-pIVKGJiy7EVy8aKebN5zg515BCs")
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
                        student = Student.objects.create(full_name=student_data["full_name"],
                                                         email=student_data["email"],
                                                         phone_number=student_data["phone_number"], active=True,
                                                         school=school,
                                                         guardian=guardian, routes=None,
                                                         student_id=student_data["student_id"])
                        if student.email is not None and student.email != "":
                            send_invite_email(student)
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
