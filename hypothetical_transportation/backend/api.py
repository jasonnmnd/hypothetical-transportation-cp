import json

from .models import UserProfile, Student, School, Route
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import UserSerializer, StudentSerializer, RouteSerializer, SchoolSerializer
from .permissions import IsAdminOrReadOnlyParent


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

    # @action(detail=True, methods=['get'])
    # def students(self, request, pk=None):
    #     assoc_students = StudentViewSet.queryset.filter(guardian__pk=pk)
    #     serial_student_data = StudentSerializer(assoc_students, many=True).data
    #     return Response(serial_student_data)


class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    permission_classes = [
        IsAdminOrReadOnlyParent
    ]
    serializer_class = RouteSerializer


class SchoolViewSet(viewsets.ModelViewSet):
    queryset = School.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = SchoolSerializer


class StudentViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = StudentSerializer

    def get_queryset(self):
        # TODO: modify this method to only return a filtered list corresponding to the parent
        return self.request.user.students.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
