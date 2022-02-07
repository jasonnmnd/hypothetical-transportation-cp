from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator
# Create your models here.
from django.conf import settings
import datetime


class School(models.Model):
    name = models.CharField(max_length=150, validators=[MinLengthValidator(1)], unique=True)
    address = models.CharField(max_length=150, validators=[MinLengthValidator(1)])
    bus_arrival_time = models.TimeField(blank=False, default=datetime.time(9, 0, 0))
    bus_departure_time = models.TimeField(blank=False, default=datetime.time(15, 0, 0))

    class Meta:
        ordering = ['id']


class Stop(models.Model):
    name = models.CharField(max_length=150)
    location = models.CharField(max_length=450)

    class Meta:
        ordering = ['id']


class Route(models.Model):
    name = models.CharField(max_length=150, validators=[MinLengthValidator(1)])
    description = models.TextField(blank=True)
    school = models.ForeignKey(
        School, related_name='routes',
        on_delete=models.CASCADE
    )
    stops = models.ManyToManyField(Stop, through="StopRoute")

    class Meta:
        ordering = ['id']


class StopRoute(models.Model):
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE)
    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created']


class Student(models.Model):
    # first_name = models.CharField(max_length=30)
    # last_name = models.CharField(max_length=30)
    full_name = models.CharField(max_length=150, validators=[MinLengthValidator(1)])
    active = models.BooleanField(default=True)
    school = models.ForeignKey(
        School, related_name='students',
        on_delete=models.CASCADE
    )
    routes = models.ForeignKey(
        Route, related_name='students',
        on_delete=models.SET_NULL, null=True, blank=True
    )
    guardian = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='students',
        on_delete=models.CASCADE
    )
    student_id = models.PositiveIntegerField(null=True)

    class Meta:
        ordering = ['id']
