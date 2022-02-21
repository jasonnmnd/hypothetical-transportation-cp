from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.apps import apps
from geopy.geocoders import Nominatim
import os
import csv

School = apps.get_model('backend', 'School')
Student = apps.get_model('backend', 'Student')
path = "backend/management/commands"
geolocator = Nominatim(user_agent="Hypothetical Transportation Database Seeder")


class Command(BaseCommand):
    help = 'Loads ECE458 CSV files into the database'

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        admin_group, _ = Group.objects.get_or_create(name='Administrator')
        guardian_group, _ = Group.objects.get_or_create(name='Guardian')
        with open(f'{path}/seed_files/parents.csv') as parent_file:
            parents = csv.reader(parent_file)
            next(parents)
            for parent_row in parents:
                full_name, email, address = parent_row
                location = geolocator.geocode(address)
                latitude = location.latitude if location else 0
                longitude = location.longitude if location else 0
                user = get_user_model().objects.create_verified_user(email=email,
                                                                     password='password',
                                                                     full_name=full_name,
                                                                     address=address,
                                                                     latitude=latitude,
                                                                     longitude=longitude)

                user.groups.add(guardian_group)
                self.stdout.write(self.style.SUCCESS(f'Created User: {full_name}'))
                break

        with open(f'{path}/seed_files/schools.csv') as school_file:
            schools = csv.reader(school_file)
            next(schools)
            for school_row in schools:
                name, address, arrival_time, departure_time = school_row
                location = geolocator.geocode(address)
                latitude = location.latitude if location else 0
                longitude = location.longitude if location else 0
                school = School.objects.create(address=address, name=name, latitude=latitude, longitude=longitude)
                self.stdout.write(self.style.SUCCESS(f'Created School: {name}'))
                break

        with open(f'{path}/seed_files/students.csv') as student_file:
            students = csv.reader(student_file)
            next(students)
            for student_row in students:
                student_id, full_name, school_name, parent_email = student_row
                school = School.objects.get(name=school_name)
                guardian = get_user_model().objects.get(email=parent_email)
                Student.objects.create(full_name=full_name, active=True, school=school, guardian=guardian,
                                       routes=None, student_id=student_id)
                self.stdout.write(self.style.SUCCESS(f'Created Student: {full_name}'))
                break
