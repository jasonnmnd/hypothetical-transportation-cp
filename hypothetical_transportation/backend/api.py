import json

from .models import UserProfile, Student, School, Route
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import UserSerializer, StudentSerializer, RouteSerializer, SchoolSerializer
from .permissions import IsAdminOrReadOnlyParent
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters


class MapsAPI(APIView):
    def get(self, request, format=None):
        return Response("Hello, World!")

    def post(self, request, format=None):
        return Response("Hello, World!")


class UserViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = UserSerializer

    @action(detail=False)
    def fields(self, request):
        # TODO: Find better representation format
        repr_str = repr(UserSerializer()).replace(' ', '')
        content = repr_str.split('\n')
        return Response(json.dumps(content))


class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    permission_classes = [
        IsAdminOrReadOnlyParent
    ]
    serializer_class = RouteSerializer


class SchoolViewSet(viewsets.ModelViewSet):
    serializer_class = SchoolSerializer
    permission_classes = [
        permissions.AllowAny
    ]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['name', 'address']
    search_fields = ['name']

    def get_queryset(self):
        return School.objects.all()


class StudentViewSet(viewsets.ModelViewSet):
    permission_classes = [
        # permissions.IsAuthenticated
        permissions.AllowAny
    ]
    serializer_class = StudentSerializer

    def get_queryset(self):
        # modify to return all if admin
        # return self.request.user.students.all()
        return Student.objects.all()

    def perform_create(self, serializer):
        serializer.save(guardian=self.request.user)
