psql -af setup.sql postgres
cd ../backend
export PYTHONPATH=$PWD
export DJANGO_SETTINGS_MODULE=backend.settings
python3 manage.py migrate