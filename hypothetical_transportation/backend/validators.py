from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from .models import Student


def validate_available_user_email(value):
    if get_user_model().objects.filter(email=value).count() != 0:
        raise ValidationError(_(f"{value} is already taken by an existing account"), params={'value': value})
