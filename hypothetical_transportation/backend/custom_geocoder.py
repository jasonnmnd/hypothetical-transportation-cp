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
        if query is None or query == "":
            return None
        if CachedLocation.objects.filter(query=query).count() > 0:
            location = CachedLocation.objects.get(query=query)
            if location.address is None or location.latitude is None or location.longitude is None:
                return None
            return Location(address=location.address,
                            point=Point(latitude=location.latitude, longitude=location.longitude), raw='')
        location = super().geocode(query, exactly_one=exactly_one, timeout=timeout, bounds=bounds, region=region,
                                   components=components, place_id=place_id, language=language, sensor=sensor)
        address = location.address if location is not None else None
        latitude = location.latitude if location is not None else None
        longitude = location.longitude if location is not None else None
        CachedLocation.objects.create(query=query, address=address, latitude=latitude, longitude=longitude)
        return location
