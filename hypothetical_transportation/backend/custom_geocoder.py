from geopy.location import Location, Point
from geopy.geocoders import GoogleV3
from geopy.geocoders.base import DEFAULT_SENTINEL

from .models import CachedLocation


class CachedGoogleV3(GoogleV3):
    def __init__(self, api_key=None):
        super().__init__(api_key=api_key)
        self.cache = dict()

    def geocode(self, query=None, *, exactly_one=True, timeout=DEFAULT_SENTINEL, bounds=None, region=None,
                components=None, place_id=None, language=None, sensor=False):
        if CachedLocation.objects.filter(query=query).count() > 0:
            location = CachedLocation.objects.get(query=query)
            return Location(address=location.address,
                            point=Point(latitude=location.latitude, longitude=location.longitude), raw='')
        location = super().geocode(query, exactly_one=exactly_one, timeout=timeout, bounds=bounds, region=region,
                                   components=components, place_id=place_id, language=language, sensor=sensor)
        CachedLocation.objects.create(query=query, address=location.address, latitude=location.latitude,
                                      longitude=location.longitude)
        return location
