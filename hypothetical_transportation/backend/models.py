from django.db import models
from django.contrib.auth.models import User

# Create your models here.
from django.conf import settings


class School(models.Model):
    name = models.CharField(max_length=150)
    address = models.CharField(max_length=150)


class Route(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    school = models.ForeignKey(
        School, related_name='routes',
        on_delete=models.CASCADE
    )


class Student(models.Model):
    # first_name = models.CharField(max_length=30)
    # last_name = models.CharField(max_length=30)
    full_name = models.CharField(max_length=150)
    active = models.BooleanField(default=True)
    school = models.ForeignKey(
        School, related_name='students',
        on_delete=models.CASCADE
    )
    routes = models.ForeignKey(
        Route, related_name='students',
        on_delete=models.SET_NULL, null=True
    )
    guardian = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='students',
        on_delete=models.CASCADE, null=True
    )
    student_id = models.PositiveIntegerField(null=True)
