from rest_framework import serializers


class SendAnnouncementSerializer(serializers.Serializer):
    object_id = serializers.IntegerField(required=False)
    id_type = serializers.ChoiceField(choices=[
        ('ROUTE', 'Route'),
        ('SCHOOL', 'School'),
        ('ALL', 'All')
    ])
    subject = serializers.CharField()
    body = serializers.CharField()
    template = serializers.CharField(required=False)
