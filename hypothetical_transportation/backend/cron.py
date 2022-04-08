# from django_q.tasks import schedule, Schedule
# import requests, json

# from hypothetical_transportation.backend.models import BusRun

# def fetch_bus_locations():
#     active_buses = BusRun.objects.filter(end_time=None).distinct().order_by('duration') # why not

#     schedule(
#         func=tranzit_traq,
#         name='tranzit_traq',
#         args=active_buses,
#         schedule_type=Schedule.CRON,
#         cron="*/10 * * * * *", # every 10 seconds
#         repeats=-1, # always repeat
#     )

# def tranzit_traq(active_buses):
#     for bus in active_buses:
#         bus = BusRun.objects.get(id=bus.id)
#         if bus.end_time is not None:
#             break
#         try:
#             url =  f"http://tranzit.colab.duke.edu:8000/get"
#             params = {'bus': bus.bus_number}
#             req = requests.get(url=url, params=params)
#             ret = json.loads(req.text)
#         except:
#             pass
import requests, json
from .models import BusRun
from .api import duration_check

def talk_to_tranzit_traq(bus):
        try:
            url =  f"http://tranzit.colab.duke.edu:8000/get"
            params = {'bus': bus}
            req = requests.get(url=url, params=params)
            ret = json.loads(req.text)
            # return Response(ret, status.HTTP_200_OK)
            data = {}
            data['bus_number'] = ret['bus']
            data['latitude'] = ret['lat']
            data['longitude'] = ret['lng']
        except:
            pass
            # return Response("Something went wrong", status.HTTP_404_NOT_FOUND)

def tranzit_traq_on_active_buses():
    active_buses = BusRun.objects.filter(end_time=None)
    for bus in active_buses:
        # bus_id=request.GET['bus']
        duration_check(bus)
        if bus.end_time is None:
            talk_to_tranzit_traq(bus)