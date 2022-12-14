# Generated by Django 3.2.11 on 2022-04-07 20:29

import backend.validators
import datetime
from django.conf import settings
import django.contrib.postgres.fields.citext
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Route',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150, validators=[django.core.validators.MinLengthValidator(1)])),
                ('description', models.TextField(blank=True)),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='School',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', django.contrib.postgres.fields.citext.CICharField(max_length=150, unique=True, validators=[django.core.validators.MinLengthValidator(1)])),
                ('address', models.CharField(max_length=150, validators=[django.core.validators.MinLengthValidator(1)])),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
                ('bus_arrival_time', models.TimeField(default=datetime.time(9, 0))),
                ('bus_departure_time', models.TimeField(default=datetime.time(15, 0))),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='TransitLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bus_number', models.PositiveIntegerField()),
                ('duration', models.TimeField(blank=True)),
                ('end_time', models.TimeField(blank=True)),
                ('going_towards_school', models.BooleanField(default=True)),
                ('start_time', models.TimeField()),
                ('driver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transit_log', to=settings.AUTH_USER_MODEL, unique=True)),
                ('route', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transit_log', to='backend.route', unique=True)),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transit_log', to='backend.school')),
            ],
            options={
                'ordering': ['start_time'],
            },
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(blank=True, max_length=255, null=True, unique=True, validators=[backend.validators.validate_available_user_email])),
                ('full_name', models.CharField(max_length=150, validators=[django.core.validators.MinLengthValidator(1)])),
                ('active', models.BooleanField(default=True)),
                ('student_id', models.PositiveIntegerField(blank=True, null=True)),
                ('phone_number', models.CharField(blank=True, max_length=35, null=True)),
                ('guardian', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='students', to=settings.AUTH_USER_MODEL)),
                ('routes', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='students', to='backend.route')),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='students', to='backend.school')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='Stop',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=150)),
                ('location', models.CharField(max_length=450)),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
                ('stop_number', models.PositiveIntegerField()),
                ('pickup_time', models.TimeField(blank=True, default=datetime.time(9, 0))),
                ('dropoff_time', models.TimeField(blank=True, default=datetime.time(15, 0))),
                ('route', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stops', to='backend.route')),
            ],
            options={
                'ordering': ['route', 'stop_number'],
            },
        ),
        migrations.AddField(
            model_name='route',
            name='school',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='routes', to='backend.school'),
        ),
        migrations.CreateModel(
            name='EstimatedTimeToNextStop',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('seconds_when_pickup', models.PositiveIntegerField(blank=True, null=True)),
                ('seconds_when_dropoff', models.PositiveIntegerField(blank=True, null=True)),
                ('stop', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='estimated_time_to_next_stop', to='backend.stop')),
            ],
        ),
        migrations.CreateModel(
            name='BusRun',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bus_number', models.PositiveIntegerField()),
                ('duration', models.TimeField(blank=True, null=True)),
                ('end_time', models.DateTimeField(blank=True, null=True)),
                ('going_towards_school', models.BooleanField(default=True)),
                ('previous_stop_index', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('start_time', models.DateTimeField()),
                ('driver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bus_run', to=settings.AUTH_USER_MODEL)),
                ('route', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bus_run', to='backend.route')),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bus_run', to='backend.school')),
            ],
            options={
                'ordering': ['start_time'],
            },
        ),
        migrations.CreateModel(
            name='ActiveBusRun',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bus_number', models.PositiveIntegerField()),
                ('going_towards_school', models.BooleanField(default=True)),
                ('previous_stop_index', models.PositiveIntegerField()),
                ('start_time', models.TimeField()),
                ('driver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='active_bus_run', to=settings.AUTH_USER_MODEL, unique=True)),
                ('route', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='active_bus_run', to='backend.route', unique=True)),
            ],
            options={
                'ordering': ['bus_number'],
            },
        ),
    ]
