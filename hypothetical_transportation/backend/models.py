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


class Route(models.Model):
    name = models.CharField(max_length=150, validators=[MinLengthValidator(1)])
    description = models.TextField(blank=True)
    school = models.ForeignKey(
        School, related_name='routes',
        on_delete=models.CASCADE
    )

    class Meta:
        ordering = ['id']


class Stop(models.Model):
    name = models.CharField(max_length=150, blank=True)
    location = models.CharField(max_length=450)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, default=0)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, default=0)
    route = models.ForeignKey(Route, related_name='stops', on_delete=models.CASCADE)
    stop_number = models.PositiveIntegerField(null=False)

    class Meta:
        ordering = ['route', 'stop_number']


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
