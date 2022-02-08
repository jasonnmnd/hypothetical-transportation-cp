from django.urls import path, include
from .api import SendAnnouncementAPI

urlpatterns = [
    path('api/send-announcement', SendAnnouncementAPI.as_view()),
]
