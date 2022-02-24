#!/bin/bash

python /code/manage.py makemigrations 
python /code/manage.py migrate 
python /code/manage.py initadmin
cd code
python manage.py seeddb_v2 --limit 10000
export AUTHEMAIL_EMAIL_HOST_USER=hypotheticaltransportations@gmail.com
export AUTHEMAIL_EMAIL_HOST_PASSWORD=avxkwyydulnzhudh
gunicorn hypothetical_transportation.wsgi:application --bind 0.0.0.0:8000
