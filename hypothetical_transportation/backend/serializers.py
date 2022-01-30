from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Route, School, Student


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'full_name', 'address', 'groups')
        # fields = ('email', 'password')

    def validate(self, data):
        return data


class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = '__all__'


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

    def validate(self, data):
        """
        Handles 1.10 of Evolution 1, Consistency Rule
        :param data:
        :return:
        """
        if not data['school'] or not data['routes']:
            # No consistency to enforce
            return data
        school = data['school']
        route = data['routes']
        if school.pk != route.school.pk:
            raise serializers.ValidationError("Student school is not the same as student route!")
        return data
