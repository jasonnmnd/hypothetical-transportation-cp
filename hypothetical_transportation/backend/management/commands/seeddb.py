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


class Command(BaseCommand):
    help = 'Populates tables of the database'

    def add_arguments(self, parser):
        parser.add_argument('--numusers', nargs='?', type=int, default=100)
        parser.add_argument('--numroutes', nargs='?', type=int, default=400)
        parser.add_argument('--numschools', nargs='?', type=int, default=400)
        parser.add_argument('--numstudents', nargs='?', type=int, default=1000)

    def handle(self, *args, **options):
        num_users = options['numusers']
        num_routes = options['numroutes']
        num_schools = options['numschools']
        num_students = options['numstudents']

        admin_group, _ = Group.objects.get_or_create(name='Administrator')
        guardian_group, _ = Group.objects.get_or_create(name='Guardian')
        data_generator = Faker()

        # Generates users
        for email_num in tqdm(range(1, num_users + 1)):
            first_name = data_generator.first_name()
            last_name = data_generator.last_name()
            address = data_generator.address()
            user = get_user_model().objects.create_user(email=f'{first_name}{last_name}{email_num}@gmail.com',
                                                        password='password',
                                                        full_name=f'{first_name} {last_name}', address=address)
            user.groups.add(guardian_group)

        for _ in tqdm(range(num_schools)):
            school_name = f'{data_generator.name()} University'
            school_address = data_generator.address()
            School.objects.create(address=school_address, name=f'{school_name}')

        for route_num in tqdm(range(1, num_routes + 1)):
            route_name = f'Route {route_num}'
            description = f'1. {data_generator.address()} \n2. {data_generator.address()} \n3. {data_generator.address()}\n'
            school_id = random.randint(1, num_schools)
            Route.objects.create(name=route_name, description=description,
                                 school=School.objects.get(id=school_id))

        for _ in tqdm(range(num_students)):
            first_name = data_generator.first_name()
            last_name = data_generator.last_name()
            guardian_id = random.randint(1, num_users)
            guardian = get_user_model().objects.get(id=guardian_id)
            route_id = random.randint(1, num_routes)
            route = Route.objects.get(id=route_id)
            school = route.school
            student_id = school.students.count() + 1
            Student.objects.create(full_name=f'{first_name} {last_name}', active=True, school=school, routes=route,
                                   guardian=guardian, student_id=student_id)
