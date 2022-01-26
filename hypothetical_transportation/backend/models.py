from django.db import models
from django.contrib.auth.models import User

# Create your models here.
from django.conf import settings


class School(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=140)


class Route(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    school = models.ForeignKey(
        School, related_name='routes',
        on_delete=models.CASCADE
    )


class Student(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    address = models.CharField(max_length=140)
    active = models.BooleanField(default=True)
    school = models.ForeignKey(
        School, related_name='students',
        on_delete=models.CASCADE
    )
    routes = models.ForeignKey(
        Route, related_name='students',
        on_delete=models.CASCADE, null=True
    )
    guardian = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='students',
        on_delete=models.CASCADE, null=True
    )
    student_id = models.IntegerField(null=True)

    class Meta:
        unique_together = ('school', 'student_id')
