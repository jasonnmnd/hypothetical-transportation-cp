from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.db.utils import IntegrityError


class Command(BaseCommand):
    help = 'Creates first user to access system'

    def add_arguments(self, parser):
        parser.add_argument('--email', nargs='?', type=str, default='admin@example.com')
        parser.add_argument('--fullname', nargs='?', type=str, default='admin')
        parser.add_argument('--password', nargs='?', type=str, default='password')
        parser.add_argument('--address', nargs='?', type=str, default='')

    def handle(self, *args, **options):
        try:
            admin_group, _ = Group.objects.get_or_create(name='Administrator')
            Group.objects.get_or_create(name='Guardian')

            admin = get_user_model().objects.create_user(email=options['email'], password=options['password'],
                                                         full_name=options['fullname'], address=options['address'])
            admin.groups.add(admin_group.id)
        except IntegrityError:
            raise CommandError('Admin user with this email already exists')
        self.stdout.write(self.style.SUCCESS('Created Initial User'))
