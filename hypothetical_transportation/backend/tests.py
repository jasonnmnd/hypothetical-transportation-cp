import json

from django.test import RequestFactory, TestCase
from django.test import Client
from .models import Student, School, Route
from django.contrib.auth import get_user_model


# Create your tests here.
class AuthenticationObjectConsistency(TestCase):
    def setUp(self):
        route = Route.objects.create(name='School Route 1', description='')

        school = School.objects.create(address='1111 Some St.', name='Eggbert Elementary')
        high_school = School.objects.create(address='7777 Some St.', name='Gravity Falls High School')
        stan = get_user_model().objects.create_user(email='stanpines@mysteryshack.com', password='mysteryshack',
                                                    full_name='Stanley Pines', address='618 Gopher Road')

        dan = get_user_model().objects.create_user(email='manlydan@gmail.com', password='wordpass',
                                                   full_name='Manly Dan', address='')

        mabel = Student.objects.create(first_name='Mabel', last_name='Pines', address='618 Gopher Road', active=True,
                                       school=school, routes=route, guardian=stan)
        dipper = Student.objects.create(first_name='Dipper', last_name='Pines', address='618 Gopher Road',
                                        active=True, school=school, routes=route, guardian=stan)
        wendy = Student.objects.create(first_name='Wendy', last_name='Corduroy', address='618 Gopher Road', active=True,
                                       school=high_school, routes=route, guardian=dan)

        self.STANS_KIDS = len(stan.students.all())
        self.INIT_NUM_USERS = len(get_user_model().objects.all())
        self.factory = RequestFactory()
        self.client = Client()

    def test_auth_register(self):
        """
        Tests that a user was created successfully
        :return: None
        """
        self.client.post('/api/auth/register',
                         json.dumps(
                             {'email': 'stanfordpines@mysteryshack.com',
                              'full_name': 'Stanford Pines',
                              'password': 'mysteryshack',
                              'address': 'Mostly an alternative dimension',
                              }),
                         content_type='application/json')
        num_users = len(get_user_model().objects.all())
        self.assertEqual(num_users, self.INIT_NUM_USERS + 1)

    def test_auth_consistent_user(self):
        """
        This test examines the functionality of login, get-user, authenticated-user's students, and log out.
        :return: None
        """
        # Content-Type: application/json is a header
        login_response = self.client.post('/api/auth/login',
                                          json.dumps(
                                              {'email': 'stanpines@mysteryshack.com', 'password': 'mysteryshack'}),
                                          content_type='application/json')
        auth_token = login_response.data['token']

        # HTTP_AUTHORIZATION corresponds to the Authorization: Token {TOKEN_VALUE} header
        get_self_response = self.client.get('/api/auth/user',
                                            HTTP_AUTHORIZATION=f'Token {auth_token}')
        self.assertEqual(get_self_response.data['email'], 'stanpines@mysteryshack.com')

        get_student_response = self.client.get('/api/student/',
                                               HTTP_AUTHORIZATION=f'Token {auth_token}')

        # Excludes Wendy by the design of the endpoint, assuming Stan is in the guardian group.
        self.assertEqual(len(get_student_response.data['results']), self.STANS_KIDS)
        self.client.post('/api/auth/logout',
                         HTTP_AUTHORIZATION=f'Token {auth_token}')
        logged_out_check_response = self.client.get('/api/auth/user',
                                                    HTTP_AUTHORIZATION=f'Token {auth_token}')
        self.assertEqual(logged_out_check_response.data['detail'].code, 'authentication_failed')
