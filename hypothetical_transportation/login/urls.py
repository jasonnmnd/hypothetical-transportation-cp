from rest_framework import routers
from .api import StudentViewset


router = routers.DefaultRouter()
router.register('api/login', StudentViewset, 'login')

urlpatterns = router.urls