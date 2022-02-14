import datetime
import math
import geopy.distance

LEN_OF_MILE = 1.0


def add_time_with_delta(time: datetime.time, time_delta: datetime.timedelta):
    new_datetime = datetime.datetime.combine(datetime.date.today(), time) + time_delta
    return datetime.time(new_datetime.hour, new_datetime.minute, new_datetime.second)


def get_distance_between(lat1, long1, lat2, long2):
    # return geopy.distance.distance((lat1, long1), (lat2, long2)).miles
    return math.sqrt((lat2 - lat1) ** 2 + (long2 - long1) ** 2)


def get_time_between(lat1, long1, lat2, long2):
    # Time should be proportional to distance.  Replace with an actual API call.
    return datetime.timedelta(hours=0, minutes=int(get_distance_between(lat1, long1, lat2, long2)), seconds=0)


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
