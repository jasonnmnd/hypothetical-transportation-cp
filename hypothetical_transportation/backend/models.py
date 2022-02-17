import decimal

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator
# Create your models here.
from django.conf import settings
import datetime
from .geo_utils import get_straightline_distance, get_time_between, add_time_with_delta, LEN_OF_MILE


class School(models.Model):
    name = models.CharField(max_length=150, validators=[MinLengthValidator(1)], unique=True)
    address = models.CharField(max_length=150, validators=[MinLengthValidator(1)])
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=False)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=False)
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
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=False)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=False)
    route = models.ForeignKey(Route, related_name='stops', on_delete=models.CASCADE)
    stop_number = models.PositiveIntegerField(null=False)

    # pickup_time = models.TimeField(blank=True, default=datetime.time(9, 0, 0))
    # dropoff_time = models.TimeField(blank=True, default=datetime.time(15, 0, 0))

    @property
    def pickup_time(self):
        assoc_school = self.route.school
        school_arrival_time = assoc_school.bus_arrival_time
        last_time = school_arrival_time
        last_address = assoc_school.latitude, assoc_school.longitude

        for stop in self.route.stops.order_by('-stop_number'):
            stop_address = stop.latitude, stop.longitude
            time_delta = get_time_between(*stop_address, *last_address)
            pickup_time = add_time_with_delta(last_time, -time_delta)
            if stop.id == self.id:
                return pickup_time
            last_time = pickup_time
            last_address = stop_address
        return last_time

    @property
    def dropoff_time(self):
        assoc_school = self.route.school
        school_departure_time = assoc_school.bus_departure_time
        last_time = school_departure_time
        last_address = assoc_school.latitude, assoc_school.longitude

        for stop in self.route.stops.order_by('-stop_number'):
            stop_address = stop.latitude, stop.longitude
            time_delta = get_time_between(*stop_address, *last_address)
            pickup_time = add_time_with_delta(last_time, time_delta)
            if stop.id == self.id:
                return pickup_time
            last_time = pickup_time
            last_address = stop_address
        return last_time

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

    # has_inrange_stop = models.BooleanField(default=False, blank=True)

    @property
    def has_inrange_stop(self):
        student_address = decimal.Decimal(self.guardian.latitude), decimal.Decimal(self.guardian.longitude)
        for stop in self.routes.stops.all():
            stop_address = stop.latitude, stop.longitude
            if get_straightline_distance(*student_address, *stop_address) < 2.0 * LEN_OF_MILE:
                return True
        return False

    class Meta:
        ordering = ['id']
