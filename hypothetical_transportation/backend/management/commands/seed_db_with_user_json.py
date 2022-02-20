from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.apps import apps
import csv

School = apps.get_model('backend', 'School')
Student = apps.get_model('backend', 'Student')
path = "/code/backend/management/commands"

class Command(BaseCommand):
    help = 'Loads initial things into the database'

    def add_arguments(self, parser):
        parser.add_argument('--email', nargs='?', type=str, default='')
        parser.add_argument('--fullname', nargs='?', type=str, default='')
        parser.add_argument('--password', nargs='?', type=str, default='password')
        parser.add_argument('--address', nargs='?', type=str, default='')

    def handle(self, *args, **options):
        admin_group, _ = Group.objects.get_or_create(name='Administrator')
        guardian_group, _ = Group.objects.get_or_create(name='Guardian')
        guardians = []
        school_list = {}
        with open(f'{path}/prepop_data/parents.csv') as parent_file:
            parents = csv.reader(parent_file)

            # parents = pd.read_csv('prepop_data/parents.csv')
            # print(parents)
            first = True
            for parent in parents:
                if not first: # this is stupid
                    full_name = parent[0]
                    email = parent[1]
                    address = parent[2]
                    user = get_user_model().objects.create_user(email=email,
                                                        password='password',
                                                        full_name=full_name,
                                                        address=address)
                    user.groups.add(guardian_group)
                    guardians.append(user)
                    self.stdout.write(self.style.SUCCESS(f'Created User: {full_name}'))
                else:
                    first = False
        
        with open(f'{path}/prepop_data/schools.csv') as school_file:
            schools = csv.reader(school_file)
            first = True
            for school in schools:
                if not first: # this is stupid
                    name = school[0]
                    address = school[1]
                    s = School.objects.create(address=address, name=name)
                    self.stdout.write(self.style.SUCCESS(f'Created School: {name}'))
                    school_list[name] = s.id
                else:
                    first = False

        with open(f'{path}/prepop_data/students.csv') as student_file:
            students = csv.reader(student_file)
            first = True
            student_index = 0
            for student in students:
                if not first: # this is stupid
                    full_name = student[0]
                    school_name = student[1]
                    specific_school = School.objects.get(id=school_list[school_name])
                    guardian = guardians[student_index]
                    Student.objects.create(full_name=full_name, active=True, school=specific_school, guardian=guardian, routes=None, student_id=student_index)
                    self.stdout.write(self.style.SUCCESS(f'Created Student: {full_name}'))
                    student_index = student_index + 1
                else:
                    first = False
