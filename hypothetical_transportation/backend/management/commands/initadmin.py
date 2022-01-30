from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.db.utils import IntegrityError


class Command(BaseCommand):
    help = 'Creates first user to access system'

    def handle(self, *args, **options):
        try:
            get_user_model().objects.create_user(email='admin@example.com', password='wordpass',
                                                 full_name='admin', address='')
        except IntegrityError:
            raise CommandError('Admin user with this email already exists')
        self.stdout.write(self.style.SUCCESS('Created Initial User'))
