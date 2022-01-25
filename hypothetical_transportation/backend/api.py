from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import School, Route, Student
from .serializers import UserSerializer, StudentSerializer, RouteSerializer, SchoolSerializer


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
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = '__all__'
    queryset = get_user_model().objects.all()

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
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = '__all__'
    queryset = Route.objects.all()

    @action(detail=False)
    def fields(self, request):
        content = parse_repr(repr(RouteSerializer()))
        return Response(content)


class SchoolViewSet(viewsets.ModelViewSet):
    serializer_class = SchoolSerializer
    permission_classes = [
        permissions.AllowAny
    ]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = '__all__'
    search_fields = ['name']

    # search_fields = [self.request.querystring]

    def get_queryset(self):
        return School.objects.all()

    @action(detail=False)
    def fields(self, request):
        content = parse_repr(repr(SchoolSerializer()))
        return Response(content)


class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    permission_classes = [
        # permissions.IsAuthenticated
        permissions.AllowAny
    ]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = '__all__'

    def get_queryset(self):
        # modify to return all if admin
        # return self.request.user.students.all()
        return Student.objects.all()

    def perform_create(self, serializer):
        serializer.save(guardian=self.request.user)

    @action(detail=False)
    def fields(self, request):
        content = parse_repr(repr(StudentSerializer()))
        return Response(content)
