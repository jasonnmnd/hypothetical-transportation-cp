import datetime
import math
import geopy.distance
import requests

LEN_OF_MILE = 1.0


def add_time_with_delta(time: datetime.time, time_delta: datetime.timedelta):
    new_datetime = datetime.datetime.combine(datetime.date.today(), time) + time_delta
    return datetime.time(new_datetime.hour, new_datetime.minute, new_datetime.second)


def get_straightline_distance(lat1, long1, lat2, long2):
    return geopy.distance.distance((lat1, long1), (lat2, long2)).miles


def get_time_between(lat1, long1, lat2, long2):
    # Time should be proportional to distance.  Replace with an actual API call.
    return datetime.timedelta(hours=0, minutes=int(get_straightline_distance(lat1, long1, lat2, long2)), seconds=0)


def query_distance_matrix(lat1, long1, lat2, long2):
    url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=40.6655101%2C-73.89188969999998&destinations=40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626&key=YOUR_API_KEY"
    payload = {}
    headers = {}
    response = requests.request("GET", url, headers=headers, data=payload)
    # print(response.text)
# def time_to_seconds(time: datetime.time):
#     return time.hour * 3600 + time.minute * 60 + time.second
#
#
# def seconds_to_time(seconds: int):
#     if seconds > 86400:
#         raise "More seconds than in a single day"
#     remaining_seconds = seconds
#     hours = remaining_seconds // 3600
#     remaining_seconds -= hours * 3600
#     minutes = remaining_seconds // 60
#     remaining_seconds -= minutes * 60
#     return datetime.time(hours, minutes, remaining_seconds)
