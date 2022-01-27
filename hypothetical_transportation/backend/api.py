from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import School, Route, Student
from .serializers import UserSerializer, StudentSerializer, RouteSerializer, SchoolSerializer
from .search import DynamicSearchFilter


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
    serializer_class = UserSerializer
    permission_classes = [
        permissions.AllowAny
    ]
    filter_backends = [DjangoFilterBackend, DynamicSearchFilter]
    filterset_fields = get_filter_dict(get_user_model())

    def get_queryset(self):
        return get_user_model().objects.all().distinct()

    @action(detail=False)
    def fields(self, request):
        content = parse_repr(repr(UserSerializer()))
        return Response(content)


class RouteViewSet(viewsets.ModelViewSet):
    serializer_class = RouteSerializer
    permission_classes = [
        # IsAdminOrReadOnlyParent
        permissions.AllowAny
    ]
    filter_backends = [DjangoFilterBackend, DynamicSearchFilter]
    filterset_fields = get_filter_dict(Route)

    def get_queryset(self):
        return Route.objects.all().distinct()

    @action(detail=False)
    def fields(self, request):
        content = parse_repr(repr(RouteSerializer()))
        return Response(content)


class SchoolViewSet(viewsets.ModelViewSet):
    serializer_class = SchoolSerializer
    permission_classes = [
        permissions.AllowAny
    ]
    filter_backends = [DjangoFilterBackend, DynamicSearchFilter]
    filterset_fields = get_filter_dict(School)

    # search_fields = [self.request.querystring]

    def get_queryset(self):
        return School.objects.all().distinct()

    @action(detail=False)
    def fields(self, request):
        content = parse_repr(repr(SchoolSerializer()))
        return Response(content)


class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    permission_classes = [
        permissions.AllowAny
    ]
    filter_backends = [DjangoFilterBackend, DynamicSearchFilter]
    filterset_fields = get_filter_dict(Student)

    def get_queryset(self):
        # modify to return all if admin
        return self.request.user.students.all().distinct()
        # return Student.objects.all().distinct()

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=False)
    def fields(self, request):
        content = parse_repr(repr(StudentSerializer()))
        return Response(content)
