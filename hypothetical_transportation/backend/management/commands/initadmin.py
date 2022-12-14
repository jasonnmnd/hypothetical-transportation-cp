from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.db.utils import IntegrityError


class Command(BaseCommand):
    help = 'Creates first user to access system'

    def add_arguments(self, parser):
        parser.add_argument('--email', nargs='?', type=str, default='admin@example.com')
        parser.add_argument('--fullname', nargs='?', type=str, default='admin')
        parser.add_argument('--password', nargs='?', type=str, default='mangoalphabetbubble51')
        parser.add_argument('--address', nargs='?', type=str, default='534 Research Dr, Durham, NC 27705')

    def handle(self, *args, **options):
        try:
            admin_group, _ = Group.objects.get_or_create(name='Administrator')
            Group.objects.get_or_create(name='Guardian')

            admin = get_user_model().objects.create_verified_user(email=options['email'], password=options['password'],
                                                                  full_name=options['fullname'],
                                                                  phone_number="9198706050",
                                                                  address=None,
                                                                  latitude=36.00361593027557,
                                                                  longitude=-78.93813641560669)
            admin.groups.add(admin_group.id)
        except IntegrityError:
            print(CommandError('Admin user with this email already exists'))
        self.stdout.write(self.style.SUCCESS('Created Initial User'))
