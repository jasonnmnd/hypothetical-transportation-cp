from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.apps import apps
from faker import Faker
import random
from tqdm import tqdm

School = apps.get_model('backend', 'School')
Route = apps.get_model('backend', 'Route')
Student = apps.get_model('backend', 'Student')

NUM_USERS = 400
NUM_ROUTES = 400
NUM_SCHOOLS = 200
NUM_STUDENTS = 1000


class Command(BaseCommand):
    help = 'Populates tables of the database'

    def handle(self, *args, **options):
        admin_group, _ = Group.objects.get_or_create(name='Administrator')
        guardian_group, _ = Group.objects.get_or_create(name='Guardian')
        data_generator = Faker()

        # Generates users
        for email_num in tqdm(range(1, NUM_USERS + 1)):
            first_name = data_generator.first_name()
            last_name = data_generator.last_name()
            address = data_generator.address()
            user = get_user_model().objects.create_user(email=f'{first_name}{last_name}{email_num}@gmail.com', password='password',
                                                        full_name=f'{first_name} {last_name}', address=address)
            user.groups.add(guardian_group)

        for _ in tqdm(range(NUM_SCHOOLS)):
            school_name = data_generator.address()
            school_address = data_generator.address()
            School.objects.create(address=school_address, name=f'{school_name}')

        for route_num in tqdm(range(1, NUM_ROUTES + 1)):
            route_name = f'Route {route_num}'
            description = data_generator.text()
            school_id = random.randint(1, NUM_SCHOOLS)
            Route.objects.create(name=route_name, description=description,
                                 school=School.objects.get(id=school_id))

        for _ in tqdm(range(NUM_STUDENTS)):
            first_name = data_generator.first_name()
            last_name = data_generator.last_name()
            guardian_id = random.randint(1, NUM_USERS)
            guardian = get_user_model().objects.get(id=guardian_id)
            route_id = random.randint(1, NUM_ROUTES)
            route = Route.objects.get(id=route_id)
            school = route.school
            Student.objects.create(full_name=f'{first_name} {last_name}', active=True, school=school, routes=route,
                                   guardian=guardian)
