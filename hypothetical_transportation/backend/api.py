from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status
from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import School, Route, Student, Stop
from .serializers import UserSerializer, StudentSerializer, RouteSerializer, SchoolSerializer, FormatStudentSerializer, \
    FormatRouteSerializer, FormatUserSerializer, EditUserSerializer, StopSerializer, CheckInrangeSerializer
from .search import DynamicSearchFilter
from .customfilters import StudentCountShortCircuitFilter
from .permissions import is_admin, IsAdminOrReadOnly, IsAdmin
from django.shortcuts import get_object_or_404
from .geo_utils import get_straightline_distance, LEN_OF_MILE
from .nav_utils import navigation_link_dropoff, navigation_link_pickup


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

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def nav_link_pickup(self, request, pk=None):
        route = get_object_or_404(self.get_queryset(), pk=pk)
        return Response(navigation_link_pickup(route))

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def nav_link_dropoff(self, request, pk=None):
        route = get_object_or_404(self.get_queryset(), pk=pk)
        return Response(navigation_link_dropoff(route))


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
                                                           stop.longitude) < 0.3 * LEN_OF_MILE]
        page = self.paginator.paginate_queryset(student_inrange_stops, request)
        return self.paginator.get_paginated_response(StopSerializer(page, many=True).data)

    @action(detail=False, permission_classes=[permissions.AllowAny])
    def fields(self, request):
        content = parse_repr(repr(StudentSerializer()))
        return Response(content)
