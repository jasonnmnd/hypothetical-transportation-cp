from django.contrib.auth.models import AbstractUser, BaseUserManager, Group
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinLengthValidator
from authemail.models import EmailUserManager, EmailAbstractUser, _generate_code, SignupCodeManager

"""
Heavily inspired by the design of django-rest-authemail
"""


# Create your models here.
class CustomEmailUserManager(EmailUserManager):
    """
    Extends the functionality of the basic EmailUserManager to verify on construction instead of accessing the field later.
    """

    def create_verified_user(self, email, password, **extra_fields):
        return super()._create_user(email, password, False, False, True, **extra_fields)


class User(EmailAbstractUser):
    first_name = None
    last_name = None
    full_name = models.CharField(_('full name'), max_length=150, help_text=_('Required'), blank=False, unique=False,
                                 null=False)
    address = models.CharField(_('address'), max_length=150, validators=[MinLengthValidator(1)])
    objects = CustomEmailUserManager()

    REQUIRED_FIELDS = []

    class Meta:
        ordering = ['id']


class AbstractVerificationCode(models.Model):
    """
    Models operations that require an access code to confirm identity
    """
    code = models.CharField(_('code'), max_length=40, primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True


class InviteCodeManager(SignupCodeManager):
    def set_user_is_verified(self, code):
        try:
            invite_code = InvitationCode.objects.get(code=code)
            invite_code.user.is_verified = True
            invite_code.user.save()
            return True
        except InvitationCode.DoesNotExist:
            pass
        return False


# class ResetPasswordCodeManager(models.Manager):


class InvitationCode(AbstractVerificationCode):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ipaddr = models.GenericIPAddressField(_('ip address'))
    objects = InviteCodeManager()

# class ResetPasswordCode(AbstractVerificationCode):
#     email = models.EmailField(_('email address'), max_length=255)
