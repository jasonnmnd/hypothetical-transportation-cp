#!/bin/bash

python /code/manage.py makemigrations
python /code/manage.py migrate
python /code/manage.py initadmin
# python /code/manage.py runserver 0.0.0.0:8000
cd code
gunicorn hypothetical_transportation.wsgi:application --bind 0.0.0.0:8000
ls -la