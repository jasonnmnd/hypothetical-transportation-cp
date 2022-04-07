import geopy.distance
from geopy.location import Location
from geopy.geocoders import GoogleV3
from geopy.geocoders.base import DEFAULT_SENTINEL

LEN_OF_MILE = 1.0


def get_straightline_distance(lat1, long1, lat2, long2):
    return geopy.distance.distance((lat1, long1), (lat2, long2)).miles


class CachedGoogleV3(GoogleV3):
    def __init__(self, api_key=None):
        super().__init__(api_key=api_key)
        self.cache = dict()

    def geocode(self, query=None, *, exactly_one=True, timeout=DEFAULT_SENTINEL, bounds=None, region=None,
                components=None, place_id=None, language=None, sensor=False):
        if query in self.cache:
            return self.cache[query]
        location = super().geocode(query, exactly_one=exactly_one, timeout=timeout, bounds=bounds, region=region,
                                   components=components, place_id=place_id, language=language, sensor=sensor)
        self.cache[query] = location
        return self.cache[query]
