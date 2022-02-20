from datetime import datetime, date, time
from django.db.models.signals import post_save
from ..models import School
import math

# """
# Changes to schools should check and update the stop and end times of all associated stops of all associated routes
# Changes to a parent should go through children and all their associated routes
# Changes to a stop should iterate through all associated children
# """

LEN_OF_MILE = 1


def subtract_times(time1, time2):
    time_diff = datetime.combine(date.today(), time2) - datetime.combine(date.today(), time1)
    return time_diff.time()


def get_distance_between(lat1, long1, lat2, long2):
    return math.sqrt((lat2 - lat1) ** 2 + (long2 - long1) ** 2)


def get_time_between(lat1, long1, lat2, long2):
    # Time should be proportional to distance.  Replace with an actual API call.
    # return datetime.time(0, int(get_distance_between(lat1, long1, lat2, long2)), 0)
    return time(0, 5, 3)


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

# def complete_consistency(sender, **kwargs):
#     """
#     Complete routine for consistency on create/update/delete.
#
#     Basically visits every non-user item in the database.
#     :param sender:
#     :param kwargs:
#     :return:
#     """
#     print('MODEL CHANGED: ', kwargs['instance'])
#     for school in School.objects.all():
#         for route in school.routes.all():
#             last_stop = school.latitude, school.longitude
#             pickup_time = school.bus_arrival_time
#             dropoff_time = school.bus_departure_time
#             for stop in route.stops.order_by('-stop_number').all():
#                 current_stop = stop.latitude, stop.longitude
#                 time_bw = get_time_between(*last_stop, *current_stop)
#                 pickup_time = seconds_to_time(time_to_seconds(pickup_time) - time_to_seconds(time_bw))
#                 dropoff_time = seconds_to_time(time_to_seconds(dropoff_time) + time_to_seconds(time_bw))
#                 # Set fields to this value
#                 stop.pickup_time = pickup_time
#                 stop.dropoff_time = dropoff_time
#                 stop.save()
#                 last_stop = current_stop
#
#             route_is_complete = True
#             for student in route.students.all():
#                 student_address = student.guardian.latitude, student.guardian.longitude
#                 student_has_in_range_route = False
#                 for stop in route.stops.all():
#                     stop_address = stop.latitude, stop.longitude
#                     if get_distance_between(*student_address, *stop_address) < 0.3 * LEN_OF_MILE:
#                         student_has_in_range_route = True
#                         student.has_inrange_stop = True
#                         student.save()
#                         break
#                 if student_has_in_range_route:
#                     continue
#                 else:
#                     route_is_complete = False
#                     break
#             route.is_complete = route_is_complete
#             route.save()

# def school_update(sender, **kwargs):
#     """
#     On school create, update, or delete
#
#     1. All stops should be updated based on the new start/end constraint
#     :param sender:
#     :param kwargs:
#     :return:
#     """
#     pass
#
#
# def stop_update(sender, **kwargs):
#     """
#     On stop create, update, or delete.  Should also be notified when parents are changed due to student address change:
#
#     1. All stops should be updated with the correct time
#     2. Students should be updated to check for this route constraint
#     :param sender:
#     :param kwargs:
#     :return:
#     """
#     # print('CALLBACK ALERT: Route Changed/Created!')
#     pass
#
#
# def student_update(sender, **kwargs):
#     """
#     On student create, update, or delete
#
#     1. School should be updated based on
#     :param sender:
#     :param kwargs:
#     :return:
#     """
#     # print('CALLBACK ALERT: Student Changed/Created!')
#     pass
