from rest_framework import routers
from django.urls import path

from .api import ActiveBusRunViewSet, BusRunViewSet, UserViewSet, StudentViewSet, RouteViewSet, SchoolViewSet, StopPlannerAPI, StopViewSet, \
    VerifyLoadedDataAPI, SubmitLoadedDataAPI, TransitLogViewSet
from rest_framework.urlpatterns import format_suffix_patterns

router = routers.DefaultRouter()
router.register('user', UserViewSet, 'user')
router.register('route', RouteViewSet, 'route')
router.register('stop', StopViewSet, 'stop')
router.register('school', SchoolViewSet, 'school')
router.register('student', StudentViewSet, 'student')
router.register('bus', ActiveBusRunViewSet, 'bus')
router.register('transit_log', TransitLogViewSet, 'transit_log')
router.register('run', BusRunViewSet, 'run')

additional_patterns = [
    path('stopplanner/inrangecheck', StopPlannerAPI.as_view()),
    path('loaded-data/validate/', VerifyLoadedDataAPI.as_view()),
    path('loaded-data/', SubmitLoadedDataAPI.as_view()),
]

urlpatterns = router.urls
urlpatterns += format_suffix_patterns(additional_patterns)
