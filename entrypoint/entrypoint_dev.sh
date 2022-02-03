#!/bin/bash

python /code/manage.py makemigrations 
python /code/manage.py migrate 
python /code/manage.py initadmin
python /code/manage.py runserver_plus 0.0.0.0:8000 --cert-file /etc/letsencrypt/live/ht-dev.colab.duke.edu/fullchain.pem --key-file /etc/letsencrypt/live/ht-dev.colab.duke.edu/privkey.pem