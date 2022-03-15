import math
import geopy.distance
import datetime

LEN_OF_MILE = 1.0


def add_time_with_delta(time: datetime.time, time_delta: datetime.timedelta):
    new_datetime = datetime.datetime.combine(datetime.date.today(), time) + time_delta
    return datetime.time(new_datetime.hour, new_datetime.minute, new_datetime.second)


def get_straightline_distance(lat1, long1, lat2, long2):
    return geopy.distance.distance((lat1, long1), (lat2, long2)).miles


def get_time_between(lat1, long1, lat2, long2):
    # Time should be proportional to distance.  Replace with an actual API call.
    return datetime.timedelta(hours=0, minutes=int(get_straightline_distance(lat1, long1, lat2, long2)), seconds=0)
