psql -af setup.sql postgres
cd ../hypothetical_transportation
export PYTHONPATH=$PWD
export DJANGO_SETTINGS_MODULE=hypothetical_transportation.settings
python3 manage.py migrate