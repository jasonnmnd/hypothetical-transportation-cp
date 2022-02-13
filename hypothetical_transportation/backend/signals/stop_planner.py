from django.db.models.signals import post_save
from ..models import School


def school_update(sender, **kwargs):
    print('CALLBACK ALERT: School Changed/Created!')


def route_update(sender, **kwargs):
    print('CALLBACK ALERT: Route Changed/Created!')


def student_update(sender, **kwargs):
    print('CALLBACK ALERT: Student Changed/Created!')
