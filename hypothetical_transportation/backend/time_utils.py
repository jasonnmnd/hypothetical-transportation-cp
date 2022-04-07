
from turtle import update
from urllib import response
import requests, json
import os
from datetime import time, datetime

from .serializers import EstimatedTimeToNextStopSerializer
from .models import EstimatedTimeToNextStop, School, Route, Stop

MAX_STOPS_IN_ONE_CALL = 1

os.environ['DISTANCE_MATRIX_API_URL'] = 'https://maps.googleapis.com/maps/api/distancematrix/json'
os.environ['DISTANCE_MATRIX_API_KEY'] = 'AIzaSyAvdhlh9wi-jrCK8fmHRChW5qhIpHByv7U'


def datetime_h_m_to_sec(date: datetime) -> int:
    """
    Change a datetime object into a value in seconds
    :param date: datetime object
    :return: integer value representing seconds
    """
    return date.hour*3600 + date.minute * 60 + (60 if date.second > 0 else 0)


def sec_to_datetime_h_m(seconds: int) -> datetime:
    """
    Change some integer into a datetime object in format HH:MM
    :param seconds: seconds
    :return: datetime object
    """
    h = seconds // 3600
    m = (seconds % 3600) // 60
    if seconds % 60 > 0:
        m = m + 1
    return time(h, m)


def update_estimated_time_to_next_stop(stop: Stop, seconds_when_pickup: int, seconds_when_dropoff: int) -> EstimatedTimeToNextStop:
    print("reached")
    print(stop)
    print(seconds_when_pickup)
    print(seconds_when_dropoff)
    try:
        print("trying")
        instance = EstimatedTimeToNextStop.objects.get(stop=stop)
        instance.seconds_when_pickup = seconds_when_pickup
        instance.seconds_when_dropoff = seconds_when_dropoff
        instance.save(update_fields=['seconds_when_pickup', 'seconds_when_dropoff'])
        print("bleh")

    except:
        print("caught")
        data = {}
        data['stop'] = stop.id
        data['seconds_when_pickup'] = seconds_when_pickup
        data['seconds_when_dropoff'] = seconds_when_dropoff
        print(data)
        serializer = EstimatedTimeToNextStopSerializer(data=data)
        print("hi hello")
        if serializer.is_valid():
            print("blah")
            serializer.save()
        else:
           print(serializer.errors)


def distance_matrix_api(matrix: list) -> json:
    """
    Given some list of addresses, fetch a distance matrix api from google
    :param matrix: list of addresses to find the time between
    :return: json response from google distance matrix api
    """
    url = os.environ.get('DISTANCE_MATRIX_API_URL')
    key = os.environ.get('DISTANCE_MATRIX_API_KEY')
    params = {'key': key, 'origins': matrix, 'destinations': matrix}
    req = requests.get(url=url, params=params)
    return json.loads(req.content)


def get_information_related_to_a_stop(stop: Stop):
    """
    Given some stop, find the information corresponding to every stop on the same route
    :param stop: valid Stop object 
    :return: int, int, Stop[], json -> the school start and stop time, the list of stops on the same route,
    and the distance matrix json
    """
    route = stop.route
    school = route.school

    school_start_time = datetime_h_m_to_sec(school.bus_arrival_time)
    school_letout_time = datetime_h_m_to_sec(school.bus_departure_time)
    matrix = ""
    matrices = []
    stops = Stop.objects.filter(route=route).distinct().order_by('stop_number')
    if len(stops) == 0:
        return 0,0,0,0, False # this is stupid
    stop_count = 1
    starting = True

    for stop in stops:
        if stop_count == 1 and starting:
            matrix = school.address + f'|{stop.latitude}, {stop.longitude}'
            starting = False
        elif stop_count == 1 and not starting:
            matrices.append(matrix)
            matrix = f'|{hold.latitude}, {hold.longitude}' + f'|{stop.latitude}, {stop.longitude}'
        else:
            matrix = matrix + f'|{stop.latitude}, {stop.longitude}'
        if stop_count == MAX_STOPS_IN_ONE_CALL:
            stop_count = 1
        else:
            stop_count = stop_count + 1
        hold = stop
    matrices.append(matrix)

    return school_start_time, school_letout_time, stops, matrices, True


def update_bus_times_for_stops_related_to_stop(stop: Stop):
    """
    Given some stop, calculate and update the dropoff and pickup times between each stop 
    on the related route, given some order determined by the states
    :param stop: valid Stop object
    :return: datetime[], datetime[], Stop[] -> list of dropoff times, list of pickup times, and list of corresponding stops
    """
    school_start_time, school_letout_time, stops, matrices, actions = get_information_related_to_a_stop(stop)
    if not actions:
        return response
    
    times = {}
    starting = True
    for group in matrices:
        res = distance_matrix_api(group)
        print(res)
        if starting:
            times['rows'] = res['rows']
            starting = False
        else:
            times['rows'] = times['rows'] + res['rows']


    school_to_stop_1 = times['rows'][0]['elements'][1]['duration']['value']
    stop_n_to_school = times['rows'][len(stops)+len(matrices)-1]['elements'][0]['duration']['value']
    # setup, handle the edge case of leaving the school
    desc_times, asc_times = [], [school_to_stop_1]
    running_desc_time, running_asc_time = 0, school_to_stop_1
    call_count = 0
    for stop_num in range(1, len(stops)):
        if (stop_num-1)%MAX_STOPS_IN_ONE_CALL==0 and stop_num>1:
            call_count = call_count+1
        if stop_num%(MAX_STOPS_IN_ONE_CALL)==0:
            prev_element = MAX_STOPS_IN_ONE_CALL-1
            prev_row = stop_num+call_count
            next_element = 1
            next_row = stop_num+call_count+1
        else:
            prev_element = stop_num%MAX_STOPS_IN_ONE_CALL-1
            prev_row = stop_num+call_count
            next_row = stop_num+call_count
            next_element = (stop_num+call_count)%(MAX_STOPS_IN_ONE_CALL)+1
            
        prev_stop = times['rows'][prev_row]['elements'][prev_element]['duration']['value']
        running_desc_time = running_desc_time + prev_stop # this is stop i to stop i-1
        desc_times.append(running_desc_time)
        
        next_stop = times['rows'][next_row]['elements'][next_element]['duration']['value']
        running_asc_time = running_asc_time + next_stop # this is stop i to stop i+1        
        asc_times.append(running_asc_time)   

    if len(stops)==1:
        desc_times.append(times['rows'][1]['elements'][0]['duration']['value'])
    else:
        running_desc_time = running_desc_time + stop_n_to_school
        desc_times.append(running_desc_time)
    
    dropoff_times = [sec_to_datetime_h_m((school_letout_time+time)%(24*3600)) for time in asc_times]

    pickup_times = []
    for time in desc_times:
        time_in_day = sec_to_datetime_h_m((school_start_time-time)%(24*3600))
        pickup_times.append(time_in_day)
        
    stop_num = 0
    print(asc_times)
    for stop in stops:
        stop.pickup_time = pickup_times[stop_num]
        stop.dropoff_time = dropoff_times[stop_num]
        stop.save(update_fields=['pickup_time', 'dropoff_time'])
        
        update_estimated_time_to_next_stop(stop, desc_times[stop_num], asc_times[stop_num])
        
        stop_num = stop_num + 1

    return response


def update_all_stops_related_to_school(school: School):
    """
    Given some school, update every stop associated.
    :param school: valid School object
    """
    related_routes = Route.objects.filter(school=school).distinct().order_by('id')
    for route in related_routes:
        # this is stupid
        stops = Stop.objects.filter(route=route).distinct().order_by('stop_number')
        if stops:
            update_bus_times_for_stops_related_to_stop(stops[0])
