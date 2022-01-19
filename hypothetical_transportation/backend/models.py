from django.db import models


# Create your models here.

class User(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField()


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
        School,
        on_delete=models.CASCADE,
    )
    routes = models.ForeignKey(
        Route,
        on_delete=models.CASCADE,
    )
    guardian = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
