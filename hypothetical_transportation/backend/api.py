from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import School, Route, Student
from .serializers import UserSerializer, StudentSerializer, RouteSerializer, SchoolSerializer, FormatStudentSerializer, \
    FormatRouteSerializer, FormatUserSerializer, EditUserSerializer
from .search import DynamicSearchFilter
from .customfilters import StudentCountShortCircuitFilter
from .permissions import is_admin, IsAdminOrReadOnly


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


class MapsAPI(APIView):
    def get(self, request, format=None):
        return Response("Hello, World!")

    def post(self, request, format=None):
        return Response("Hello, World!")


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [
        # permissions.IsAuthenticated
        IsAdminOrReadOnly
    ]
    filter_backends = [DjangoFilterBackend, DynamicSearchFilter, filters.OrderingFilter]
    filterset_fields = get_filter_dict(get_user_model())
    ordering_fields = ['email', 'full_name']
    ordering = 'id'

    def get_serializer_class(self):
        if self.action == 'partial_update' or self.action == 'update':
            return EditUserSerializer
        if self.action == 'list' or self.action == 'retrieve':
            return FormatUserSerializer
        return UserSerializer

    def get_queryset(self):
        if is_admin(self.request.user):
            return get_user_model().objects.all().distinct()
        else:
            return get_user_model().objects.filter(id=self.request.user.id).distinct()

    @action(detail=False, permission_classes=[permissions.AllowAny])
    def fields(self, request):
        content = parse_repr(repr(UserSerializer()))
        return Response(content)


class RouteViewSet(viewsets.ModelViewSet):
    permission_classes = [
        IsAdminOrReadOnly
        # permissions.IsAuthenticated
    ]
    filter_backends = [DjangoFilterBackend, DynamicSearchFilter, StudentCountShortCircuitFilter]
    filterset_fields = get_filter_dict(Route)
    ordering_fields = ['school__name', 'name', 'students']
    ordering = 'id'

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return FormatRouteSerializer
        return RouteSerializer

    def get_queryset(self):
        # Only return routes associated with children of current user
        if is_admin(self.request.user):
            return Route.objects.all().distinct()
        else:
            students_queryset = self.request.user.students
            return Route.objects.filter(id__in=students_queryset.values('routes_id')).distinct()
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
    ordering_fields = ['name']
    ordering = 'id'

    # search_fields = [self.request.querystring]

    def get_queryset(self):
        if is_admin(self.request.user):
            return School.objects.all().distinct()
        else:
            # Only return schools associated with children of current user
            students_queryset = self.request.user.students
            return School.objects.filter(id__in=students_queryset.values('school_id')).distinct()

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
    ordering_fields = ['school__name', 'student_id', 'full_name']
    ordering = 'id'

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return FormatStudentSerializer
        return StudentSerializer

    def get_queryset(self):
        # return Student.objects.all().distinct()
        if is_admin(self.request.user):
            return Student.objects.all().distinct()
        else:
            return self.request.user.students.all().distinct()

    # def perform_create(self, serializer):
    #     serializer.save()

    @action(detail=False, permission_classes=[permissions.AllowAny])
    def fields(self, request):
        content = parse_repr(repr(StudentSerializer()))
        return Response(content)
