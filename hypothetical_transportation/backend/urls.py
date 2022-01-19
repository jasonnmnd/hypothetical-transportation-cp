from rest_framework import routers
from .api import UserViewSet, StudentViewSet, RouteViewSet, SchoolViewSet

router = routers.DefaultRouter()
router.register('user', UserViewSet, 'user')
router.register('route', RouteViewSet, 'route')
router.register('school', SchoolViewSet, 'school')
router.register('student', StudentViewSet, 'student')

urlpatterns = router.urls