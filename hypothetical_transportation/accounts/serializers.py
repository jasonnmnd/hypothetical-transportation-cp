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


# Change Password Serializers
class ChangePasswordSerializer(serializers.Serializer):
    model = get_user_model()
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'full_name', 'address', 'groups')


# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'full_name', 'password', 'address', 'groups')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = get_user_model().objects.create_user(
            validated_data['email'],
            validated_data['password'],
            full_name=validated_data['full_name'],
            address=validated_data['address'],
        )
        user.groups.add(*validated_data['groups'])
        return user


# Login Serializer
class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")
