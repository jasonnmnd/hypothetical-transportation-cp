from email.policy import default
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator
from django.contrib.postgres.fields import CICharField
from django.conf import settings
import datetime
from .validators import validate_available_user_email
from .geo_utils import get_straightline_distance, LEN_OF_MILE


class School(models.Model):
    name = CICharField(max_length=150, validators=[MinLengthValidator(1)], unique=True)
    address = models.CharField(max_length=150, validators=[MinLengthValidator(1)])
    latitude = models.FloatField(blank=False)
    longitude = models.FloatField(blank=False)
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

    # is_complete = models.BooleanField(default=False, blank=True)
    @property
    def is_complete(self):
        for student in self.students.all():
            if not student.has_inrange_stop:
                return False
        return True

    class Meta:
        ordering = ['id']

class Stop(models.Model):
    name = models.CharField(max_length=150, blank=True)
    location = models.CharField(max_length=450)
    latitude = models.FloatField(blank=False)
    longitude = models.FloatField(blank=False)
    route = models.ForeignKey(Route, related_name='stops', on_delete=models.CASCADE)
    stop_number = models.PositiveIntegerField(null=False)
    pickup_time = models.TimeField(blank=True, default=datetime.time(9, 0, 0))
    dropoff_time = models.TimeField(blank=True, default=datetime.time(15, 0, 0))

    class Meta:
        ordering = ['route', 'stop_number']


class ActiveBusRun(models.Model):
    bus_number = models.PositiveIntegerField(null=False)
    driver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='active_bus_run',
        on_delete=models.CASCADE,
        unique=True,
        null=False
    )
    going_towards_school = models.BooleanField(default=True, null=False)
    previous_stop_index = models.PositiveIntegerField(null=False) # note: this is not a foreign key because all we need is the stop number
    route = models.ForeignKey(Route, related_name='active_bus_run', on_delete=models.CASCADE, unique=True)
    start_time = models.TimeField(blank=False)

    class Meta:
        ordering = ['bus_number']

class TransitLog(models.Model):
    bus_number = models.PositiveIntegerField(null=False)
    driver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='transit_log',
        on_delete=models.CASCADE,
        unique=True,
        null=False
    )
    duration = models.TimeField(blank=True)
    end_time = models.TimeField(blank=True)
    going_towards_school = models.BooleanField(default=True, null=False)
    route = models.ForeignKey(Route, related_name='transit_log', on_delete=models.CASCADE, unique=True)
    school = models.ForeignKey(School, related_name='transit_log', on_delete=models.CASCADE)
    start_time = models.TimeField(null=False, blank=False)

    class Meta:
        ordering = ['start_time']

class BusRun(models.Model):
    bus_number = models.PositiveIntegerField(null=False)
    driver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='bus_run',
        on_delete=models.CASCADE,
        null=False,
    )
    duration = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    going_towards_school = models.BooleanField(default=True, null=False)
    # previous_stop = models.ForeignKey(
    #     Stop,
    #     related_name='bus_run',
    #     on_delete=models.SET_NULL,
    #     null=True
    # )
    previous_stop_index = models.PositiveIntegerField(blank=True, null=True, default=0)
    route = models.ForeignKey(
        Route,
        related_name='bus_run', 
        on_delete=models.CASCADE,
    )
    school = models.ForeignKey(
        School,
        related_name='bus_run',
        on_delete=models.CASCADE
    )
    start_time = models.TimeField(null=False, blank=False)

    class Meta:
        ordering = ['start_time']

class Student(models.Model):
    # first_name = models.CharField(max_length=30)
    # last_name = models.CharField(max_length=30)
    email = models.EmailField(max_length=255, unique=True, null=True, blank=True,
                              validators=[validate_available_user_email])
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
    student_id = models.PositiveIntegerField(null=True, blank=True)
    phone_number = models.CharField(max_length=35, blank=True, null=True)
    # has_inrange_stop = models.BooleanField(default=False, blank=True)

    @property
    def has_inrange_stop(self):
        student_address = self.guardian.latitude, self.guardian.longitude
        for stop in self.routes.stops.all():
            stop_address = stop.latitude, stop.longitude
            if get_straightline_distance(*student_address, *stop_address) < 0.3 * LEN_OF_MILE:
                return True
        return False

    class Meta:
        ordering = ['id']
