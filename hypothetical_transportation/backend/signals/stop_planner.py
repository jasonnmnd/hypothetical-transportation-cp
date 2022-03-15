from django.db.models.signals import post_save
from ..models import School, Stop
from ..time_utils import update_bus_times_for_stops_related_to_stop, update_all_stops_related_to_school
import math

LEN_OF_MILE = 1

def school_update(sender, **kwargs):
    # print(kwargs)
    # print('CALLBACK ALERT: School Changed/Created!')
    update_all_stops_related_to_school(kwargs['instance'])

def stop_delete(sender, **kwargs):
    update_bus_times_for_stops_related_to_stop(kwargs['instance'])

def stop_update(sender, **kwargs):
    update_fields = kwargs['update_fields']
    
    # if kwargs['created']:
        # print(kwargs['instance'])
    # print(kwargs)
        
    if update_fields:
        if 'pickup_time' not in update_fields and 'dropoff_time' not in update_fields:
            # print("here")
            update_bus_times_for_stops_related_to_stop(kwargs['instance'])
    else:
        # print("there")
        update_bus_times_for_stops_related_to_stop(kwargs['instance'])


    # print('CALLBACK ALERT: Stop Changed/Created/Deleted!')
