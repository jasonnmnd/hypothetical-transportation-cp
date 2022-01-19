from .models import User, Student, School, Route
from rest_framework import viewsets, permissions
from .serializers import UserSerializer, StudentSerializer, RouteSerializer, SchoolSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = UserSerializer


class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = RouteSerializer


class SchoolViewSet(viewsets.ModelViewSet):
    queryset = School.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = SchoolSerializer


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = StudentSerializer
