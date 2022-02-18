from django.urls import path, include
from .api import SendAnnouncementAPI, SendRouteAnnouncementAPI

urlpatterns = [
    path('api/send-announcement', SendAnnouncementAPI.as_view()),
    path('api/send-route-announcement', SendRouteAnnouncementAPI.as_view()),
]
