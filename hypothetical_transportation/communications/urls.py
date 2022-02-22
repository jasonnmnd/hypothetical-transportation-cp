from django.urls import path, include
from .api import SendAnnouncementAPI, SendRouteAnnouncementAPI

urlpatterns = [
    path('api/communication/send-announcement', SendAnnouncementAPI.as_view()),
    path('api/communication/send-route-announcement', SendRouteAnnouncementAPI.as_view()),
]
