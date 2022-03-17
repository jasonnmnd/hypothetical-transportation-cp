from .models import Route, Stop

MAX_STOPS_IN_ONE_NAV_LINK = 10
NAV_PREFIX = "https://www.google.com/maps/dir/"


def navigation_link_pickup(route: Route):
    links = []
    stops = Stop.objects.filter(route=route).distinct().order_by('-stop_number')
    if(len(stops) == 0): return links

    stop_count = 1
    school_address = route.school.address.replace(' ','+')
    starting = True
    # generate the links from the school, and to the school at the same time
    for stop in stops:
        # update the strings
        if stop_count == 1 and starting:
            waypoints = f'{stop.latitude},{stop.longitude}/'
            starting = False
        elif stop_count == 1 and not starting:
            # append the last one, which has maxed out
            links.append(f'{NAV_PREFIX}{waypoints}')
            # start anew
            waypoints = f'{hold.latitude},{hold.longitude}/{stop.latitude},{stop.longitude}/'
            stop_count = stop_count + 1
        else:
            waypoints = waypoints + f'{stop.latitude},{stop.longitude}/'
        
        # decide to start a new link, or keep adding to the one we're on right now
        if stop_count == MAX_STOPS_IN_ONE_NAV_LINK:
            stop_count = 1
        else:
            stop_count = stop_count + 1
        
        # save the visited stop in case the next one is a new link
        hold = stop
    if stop_count == 1 and len(stops) >= MAX_STOPS_IN_ONE_NAV_LINK:
        links.append(f'{NAV_PREFIX}{waypoints}')
        links.append(f'{NAV_PREFIX}{hold.latitude},{hold.longitude}/{school_address}')
    else:
        links.append(f'{NAV_PREFIX}{waypoints}{school_address}')
    return links


def navigation_link_dropoff(route: Route):
    links = []
    stops = Stop.objects.filter(route=route).distinct().order_by('stop_number')
    if(len(stops) == 0): return links

    stop_count = 1
    school_address = route.school.address.replace(' ','+')
    starting = True

    # generate the links from the school, and to the school at the same time
    for stop in stops:
        # update the strings
        if stop_count == 1 and starting:
            waypoints = school_address + f'/{stop.latitude},{stop.longitude}/'
            stop_count = stop_count + 1
            starting = False
        elif stop_count == 1 and not starting:
            # append the last one, which has maxed out
            links.append(f'{NAV_PREFIX}{waypoints}')
            # start anew
            waypoints = f'{hold.latitude},{hold.longitude}/{stop.latitude},{stop.longitude}/'
            stop_count = stop_count + 1
        else:
            waypoints = waypoints + f'{stop.latitude},{stop.longitude}/'
        
        # decide to start a new link, or keep adding to the one we're on right now
        if stop_count == MAX_STOPS_IN_ONE_NAV_LINK:
            stop_count = 1
        else:
            stop_count = stop_count + 1
        
        # save the visited stop in case the next one is a new link
        hold = stop

    links.append(f"{NAV_PREFIX}{waypoints}")

    return links
