from login.models import Student
from rest_framework import viewsets, permissions
from .serializers import StudentSerializer


class StudentViewset(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = StudentSerializer