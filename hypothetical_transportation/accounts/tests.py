import json
from django.test import TestCase
from django.test import RequestFactory, TestCase
from django.test import Client
from django.contrib.auth import get_user_model
from .serializers import UserSerializer


# Create your tests here.

class AuthenticationActions(TestCase):
    def setUp(self):
        self.newuser = get_user_model().objects.create_verified_user(email='az@gmail.com', password='bassword',
                                                                     full_name='Aziraphale', address='', latitude=0,
                                                                     longitude=0)
        self.factory = RequestFactory()
        self.client = Client()
        response = self.client.post('/api/auth/login',
                                    json.dumps(
                                        {'email': 'az@gmail.com', 'password': 'bassword'}
                                    ), content_type='application/json')
        self.auth_token = response.data['token']

    def test_invite_workflow(self):
        """
        Tests the custom-written invite workflow

        Invites a new user, verifies that the user begins as unverified.  Afterwards, verification through the POST
        endpoint should change this status, enabling them to log in.
        :return:
        """
        invite_response = self.client.post("/api/auth/invite", json.dumps(
            {"email": "georgehong365@gmail.com", "full_name": "George Hong", "address": "6466 Cog Hill Lane",
             "latitude": 0, "longitude": 0, "groups": []}), content_type="application/json",
                                           HTTP_AUTHORIZATION=f"Token {self.auth_token}")
        new_user_id = invite_response.data["id"]
        self.assertEqual(get_user_model().objects.get(pk=new_user_id).is_verified, False)
        code = invite_response.data["code"]

        verify_response = self.client.get(f"/api/auth/invite/verify?code={code}")
        self.assertEqual(verify_response.status_code, 200)

        verified_response = self.client.post("/api/auth/invite/verified",
                                             json.dumps({"password": "newpassword", "code": code}),
                                             content_type="application/json")
        self.assertEqual(verified_response.status_code, 201)
        self.assertEqual(get_user_model().objects.get(pk=new_user_id).is_verified, True)

    def test_change_password_works(self):
        change_password_response = self.client.put('/api/auth/change-password',
                                                   json.dumps(
                                                       {'old_password': 'bassword',
                                                        'new_password': 'bassword2'}
                                                   ), content_type='application/json',
                                                   HTTP_AUTHORIZATION=f'Token {self.auth_token}')
        self.assertEqual(change_password_response.data['status'], 'success')
        old_pw_login_response = self.client.post('/api/auth/login',
                                                 json.dumps(
                                                     {'email': 'az@gmail.com', 'password': 'bassword'}
                                                 ), content_type='application/json')
        self.assertEqual(old_pw_login_response.data['non_field_errors'][0].code, 'invalid')
        new_pw_login_response = self.client.post('/api/auth/login',
                                                 json.dumps(
                                                     {'email': 'az@gmail.com', 'password': 'bassword2'}
                                                 ), content_type='application/json')
        self.assertEqual(new_pw_login_response.data['user']['email'], 'az@gmail.com')

    def test_incorrect_change_password_credentials(self):
        change_password_response = self.client.put('/api/auth/change-password',
                                                   json.dumps(
                                                       {'old_password': 'password',
                                                        'new_password': 'bassword2'}
                                                   ), content_type='application/json',
                                                   HTTP_AUTHORIZATION=f'Token {self.auth_token}')
        self.assertEqual(change_password_response.data['old_password'][0], 'Wrong password.')
