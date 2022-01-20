import json

from .models import User, Student, School, Route
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import UserSerializer, StudentSerializer, RouteSerializer, SchoolSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
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

    # @action(detail=True, methods=['get'])
    # def students(self, request, pk=None):
    #     assoc_students = StudentViewSet.queryset.filter(guardian__pk=pk)
    #     serial_student_data = StudentSerializer(assoc_students, many=True).data
    #     return Response(serial_student_data)


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
