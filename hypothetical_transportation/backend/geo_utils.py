import geopy.distance

LEN_OF_MILE = 1.0


def get_straightline_distance(lat1, long1, lat2, long2):
    return geopy.distance.distance((lat1, long1), (lat2, long2)).miles
