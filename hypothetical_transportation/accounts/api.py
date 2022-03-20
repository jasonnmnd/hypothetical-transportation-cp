from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from knox.models import AuthToken
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, ChangePasswordSerializer, \
    InviteVerifiedSerializer, InviteSerializer, StaffInviteSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from backend.permissions import IsAdmin, IsSchoolStaff, is_school_staff
from .models import InvitationCode


# Invite API
class InviteAPI(generics.GenericAPIView):
    serializer_class = InviteSerializer
    permission_classes = [IsAdmin | IsSchoolStaff]

    def get_serializer_class(self):
        if is_school_staff(self.request.user):
            return StaffInviteSerializer
        return InviteSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(raise_exception=True):
            email = serializer.data['email']
            full_name = serializer.data['full_name']
            phone_number = serializer.data['phone_number']
            address = serializer.data['address']
            latitude = serializer.data['latitude']
            longitude = serializer.data['longitude']
            groups = serializer.data['groups']
            managed_schools = serializer.data['managed_schools']
            try:
                user = get_user_model().objects.get(email=email)
                content = {'detail': 'Email address already taken.'}
                return Response(content, status=status.HTTP_201_CREATED)
            except get_user_model().DoesNotExist:
                user = get_user_model().objects.create_user(email=email, latitude=latitude, longitude=longitude)
            user.set_unusable_password()
            user.address = address
            user.full_name = full_name
            user.phone_number = phone_number
            # Default case for staff privileges
            if not groups and Group.objects.filter(name="Guardian").count() > 0:
                user.groups.add(Group.objects.get(name="Guardian"))
            user.groups.add(*groups)
            user.managed_schools.add(*managed_schools)

            user.save()
            ipaddr = self.request.META.get('REMOTE_ADDR', '0.0.0.0')
            invite_code = InvitationCode.objects.create_signup_code(user=user, ipaddr=ipaddr)
            invite_code.send_invitation_email()
            content = {
                'id': user.id,
                'email': user.email,
                'full_name': user.full_name,
                'code': invite_code.code,
            }
            return Response(content, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InviteVerifyAPI(generics.GenericAPIView):
    permission_classes = [
        permissions.AllowAny
    ]

    def get(self, request, *args, **kwargs):
        code = request.GET.get('code', '')
        try:
            signup_code = InvitationCode.objects.get(code=code)
            # TODO: add expiration check to invitations
            content = {'success': 'Invitation verified.'}
            return Response(content, status=status.HTTP_200_OK)
        except InvitationCode.DoesNotExist:
            content = {'detail': 'Unable to verify invitation'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)


class InviteVerifiedAPI(generics.GenericAPIView):
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = InviteVerifiedSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            code = serializer.data['code']
            password = serializer.data['password']
            verified = InvitationCode.objects.set_user_is_verified(code)
            if verified:
                try:
                    signup_code = InvitationCode.objects.get(code=code)
                    signup_code.user.set_password(password)
                    signup_code.user.save()
                    signup_code.delete()
                except InvitationCode.DoesNotExist:
                    pass
                content = {'success': 'User verified and password set'}
                return Response(content, status=status.HTTP_201_CREATED)
            else:
                content = {'detail': 'Unable to verify user'}
                return Response(content, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [
        IsAdmin
    ]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user,
                                   context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })


# Login API
class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user,
                                   context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })


# Get User API
class UserAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordAPI(generics.UpdateAPIView):
    """
    An endpoint for changing password.

    Built from
    """
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = ChangePasswordSerializer
    model = get_user_model()

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
                'data': []
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
