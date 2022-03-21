#!/bin/bash
cd code
python manage.py makemigrations 
python manage.py migrate 
python manage.py initadmin
python manage.py loaddata backend/fixtures/schools.json backend/fixtures/groups.json
export AUTHEMAIL_EMAIL_HOST_USER=hypotheticaltransportations@gmail.com
export AUTHEMAIL_EMAIL_HOST_PASSWORD=avxkwyydulnzhudh
gunicorn hypothetical_transportation.wsgi:application --bind 0.0.0.0:8000
