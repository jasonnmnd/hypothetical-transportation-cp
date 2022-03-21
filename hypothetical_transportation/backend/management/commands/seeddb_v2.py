from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.apps import apps
from geopy.geocoders import Nominatim, GoogleV3
import datetime
import os
import csv

School = apps.get_model('backend', 'School')
Student = apps.get_model('backend', 'Student')
path = "backend/management/commands"

#geolocator = Nominatim(user_agent="Hypothetical Transportation Database Seeder")
geolocator = GoogleV3(api_key="AIzaSyDsyPs-pIVKGJiy7EVy8aKebN5zg515BCs")

class Command(BaseCommand):
    help = 'Loads ECE458 CSV files into the database'

    def add_arguments(self, parser):
        parser.add_argument('--limit', nargs='?', type=int, default=10,
                            help='Maximum count of school, student, and user objects to generate to limit usage of '
                                 'API key (each has [LIMIT] objects generated).  Set to a large value to generate all '
                                 'objects.')

    def handle(self, *args, **options):
        limit = options['limit']
        admin_group, _ = Group.objects.get_or_create(name='Administrator')
        guardian_group, _ = Group.objects.get_or_create(name='Guardian')
        with open(f'{path}/seed_files/parents.csv') as parent_file:
            parents = csv.reader(parent_file)
            next(parents)
            for parent_num, parent_row in enumerate(parents):
                if parent_num == limit:
                    break
                full_name, email, address = parent_row
                location = geolocator.geocode(address)
                latitude = location.latitude if location else 0
                longitude = location.longitude if location else 0
                user = get_user_model().objects.create_verified_user(email=email,
                                                                     password='salamanderballoonmilkshake5',
                                                                     full_name=full_name,
                                                                     address=address,
                                                                     latitude=latitude,
                                                                     longitude=longitude)

                user.groups.add(guardian_group)
                self.stdout.write(self.style.SUCCESS(f'Created User: {full_name}'))

        with open(f'{path}/seed_files/schools.csv') as school_file:
            schools = csv.reader(school_file)
            next(schools)
            for school_num, school_row in enumerate(schools):
                if school_num == limit:
                    break
                name, address, arrival_time_str, departure_time_str = school_row
                location = geolocator.geocode(address)
                latitude = location.latitude if location else 0
                longitude = location.longitude if location else 0
                arrival_time = datetime.datetime.strptime(arrival_time_str, "%H%M").time()
                departure_time = datetime.datetime.strptime(departure_time_str, "%H%M").time()
                school = School.objects.create(address=address, name=name, latitude=latitude, longitude=longitude,
                                               bus_arrival_time=arrival_time, bus_departure_time=departure_time)
                self.stdout.write(self.style.SUCCESS(f'Created School: {name}'))

        with open(f'{path}/seed_files/students.csv') as student_file:
            students = csv.reader(student_file)
            next(students)
            for student_num, student_row in enumerate(students):
                if student_num == limit:
                    break
                student_id, full_name, school_name, parent_email = student_row
                school = School.objects.get(name=school_name)
                guardian = get_user_model().objects.get(email=parent_email)
                student_id = student_id if student_id else None
                Student.objects.create(full_name=full_name, active=True, school=school, guardian=guardian,
                                       routes=None, student_id=student_id)
                self.stdout.write(self.style.SUCCESS(f'Created Student: {full_name}'))
