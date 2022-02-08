from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import SendAnnouncementSerializer

from django.contrib.auth import get_user_model
from backend.models import School, Route


class SendAnnouncementAPI(generics.GenericAPIView):
    serializer_class = SendAnnouncementSerializer
    permission_classes = [
        permissions.AllowAny
    ]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        id_type = serializer.data.get("id_type")
        print(School.objects.all())
        if id_type == "ROUTE":
            pass
        elif id_type == "SCHOOL":
            pass
        else:
            pass

        return Response({"Hello": "World"})
