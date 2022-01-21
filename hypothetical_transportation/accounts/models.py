from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


# Create your models here.

class User(AbstractUser):
    # https://stackoverflow.com/questions/49134831/django-make-user-email-required
    email = models.EmailField(_('email address'), blank=False)
