import json

from django.test import RequestFactory, TestCase
from django.test import Client
from .models import Student, School, Route
from django.contrib.auth import get_user_model


# Create your tests here.
class StudentCreation(TestCase):
    def setUp(self):
        route = Route.objects.create(name='School Route 1', description='')

        school = School.objects.create(address='1111 Some St.', name='Eggbert Elementary')
        high_school = School.objects.create(address='7777 Some St.', name='Gravity Falls High School')
        stan = get_user_model().objects.create_user('stan.pines', 'stanpines@mysteryshack.com', 'mysteryshack')

        dan = get_user_model().objects.create(username='manly.dan', email='manlydan@gmail.com', password='wordpass')

        mabel = Student.objects.create(first_name='Mabel', last_name='Pines', address='618 Gopher Road', active=True,
                                       school=school, routes=route, guardian=stan)
        dipper = Student.objects.create(first_name='Dipper', last_name='Pines', address='618 Gopher Road',
                                        active=True, school=school, routes=route, guardian=stan)
        wendy = Student.objects.create(first_name='Wendy', last_name='Corduroy', address='618 Gopher Road', active=True,
                                       school=high_school, routes=route, guardian=dan)
        self.factory = RequestFactory()
        self.client = Client()

    def test_save(self):
        response = self.client.post('/api/auth/login',
                                    json.dumps({'email': 'stanpines@mysteryshack.com', 'password': 'mysteryshack'}),
                                    content_type='application/json')
        auth_token = response.data['token']
        response = self.client.get('/api/auth/user',
                                   Authorization=f'Token {auth_token}')

        print(response.data)
