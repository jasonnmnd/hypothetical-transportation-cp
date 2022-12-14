from rest_framework import serializers
# from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('name',)


class InviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = (
            'id', 'email', 'full_name', 'phone_number', 'address', 'latitude', 'longitude', 'groups', 'managed_schools')


class StaffInviteSerializer(serializers.ModelSerializer):
    groups = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'full_name', 'phone_number', 'address', 'latitude', 'longitude', 'groups')


class InviteVerifiedSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=255)
    password = serializers.CharField(required=True, min_length=1)


# Change Password Serializers
class ChangePasswordSerializer(serializers.Serializer):
    model = get_user_model()
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = (
        'id', 'email', 'full_name', 'phone_number', 'address', 'latitude', 'longitude', 'groups', 'managed_schools',
        'linked_student')


# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = (
            'id', 'email', 'full_name', 'phone_number', 'password', 'address', 'latitude', 'longitude', 'groups',
            'managed_schools', 'linked_student')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = get_user_model().objects.create_user(
            validated_data['email'],
            validated_data['password'],
            full_name=validated_data['full_name'],
            phone_number=validated_data['phone_number'],
            address=validated_data['address'],
            latitude=validated_data['latitude'],
            longitude=validated_data['longitude'],
        )
        user.groups.add(*validated_data['groups'])
        user.managed_schools.add(*validated_data['managed_schools'])
        user.is_verified = True
        return user


# Login Serializer
class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active and user.is_verified:
            return user
        raise serializers.ValidationError("Incorrect Credentials")
