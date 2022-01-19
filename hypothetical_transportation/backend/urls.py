from rest_framework import routers
from .api import UserViewSet, StudentViewSet

router = routers.DefaultRouter()
router.register('user', UserViewSet, 'user')
router.register('student', StudentViewSet, 'student')

urlpatterns = router.urls