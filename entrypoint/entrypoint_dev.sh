#!/bin/bash

python /code/manage.py makemigrations 
python /code/manage.py migrate 
python /code/manage.py initadmin
# python /code/manage.py loaddata backend/fixtures/schools.json backend/fixtures/groups.json
# python /code/manage.py runserver_plus 0.0.0.0:8000 --cert-file /etc/letsencrypt/live/ht-dev.colab.duke.edu/fullchain.pem --key-file /etc/letsencrypt/live/ht-dev.colab.duke.edu/privkey.pem
cd code
python manage.py loaddata backend/fixtures/schools.json backend/fixtures/groups.json
python manage.py crontab add
export AUTHEMAIL_EMAIL_HOST_USER=hypotheticaltransportations@gmail.com
export AUTHEMAIL_EMAIL_HOST_PASSWORD=avxkwyydulnzhudh
gunicorn hypothetical_transportation.wsgi:application --bind 0.0.0.0:8000 --timeout 300 --threads 2
