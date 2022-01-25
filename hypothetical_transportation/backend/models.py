from django.db import models
from django.contrib.auth.models import User

# Create your models here.
from django.conf import settings


class UserProfile(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField()
    # password = models.CharField(max_length=256) # stored password hash
    address = models.CharField(max_length=140,
                               blank=True)  # ev1 required only if there are students belonging to this user
    admin = models.BooleanField(default=False)


class Route(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()


class School(models.Model):
    address = models.CharField(max_length=140)
    name = models.CharField(max_length=100)


class Student(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    address = models.CharField(max_length=140)
    active = models.BooleanField(default=True)
    school = models.ForeignKey(
        School, related_name='students',
        on_delete=models.CASCADE,
    )
    routes = models.ForeignKey(
        Route, related_name='students',
        on_delete=models.CASCADE,
    )
    guardian = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='students',
        on_delete=models.CASCADE,
    )
    student_id = models.IntegerField(null=True)

    class Meta:
        unique_together = ('school', 'student_id')


