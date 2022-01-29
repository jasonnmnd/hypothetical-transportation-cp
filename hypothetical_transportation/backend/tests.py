import json

from django.test import RequestFactory, TestCase
from django.test import Client
from .models import Student, School, Route
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group


# Create your tests here.
class AuthenticationObjectConsistency(TestCase):
    def setUp(self):
        stan = get_user_model().objects.create_user(email='stanpines@mysteryshack.com', password='mysteryshack',
                                                    full_name='Stanley Pines', address='618 Gopher Road')
        dan = get_user_model().objects.create_user(email='manlydan@gmail.com', password='wordpass',
                                                   full_name='Manly Dan', address='')
        school = School.objects.create(address='1111 Some St.', name='Eggbert Elementary')
        high_school = School.objects.create(address='7777 Some St.', name='Gravity Falls High School')
        route = Route.objects.create(name='School Route 1', description='', school=school)

        mabel = Student.objects.create(full_name='Mabel Pines', address='618 Gopher Road', active=True,
                                       school=school, routes=route, guardian=stan, student_id=1)
        dipper = Student.objects.create(full_name='Dipper Pines', address='618 Gopher Road',
                                        active=True, school=school, routes=route, guardian=stan, student_id=2)
        wendy = Student.objects.create(full_name='Wendy Corduroy', address='618 Gopher Road', active=True,
                                       school=high_school, routes=route, guardian=dan, student_id=1)

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
                              'groups': [],
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


class PermissionViews(TestCase):
    def setUp(self):
        admin_group = Group.objects.create(name='Administrator')
        guardian_group = Group.objects.create(name='Guardian')

        # SET UP ADMINISTRATOR
        admin_user = get_user_model().objects.create_user(email='admin@example.com', password='wordpass',

                                                          full_name='admin user', address='')
        admin_user.groups.add(admin_group)
        login_response = self.client.post('/api/auth/login',
                                          json.dumps(
                                              {'email': 'admin@example.com', 'password': 'wordpass'}),
                                          content_type='application/json')
        self.admin_token = login_response.data['token']
        self.admin_user = admin_user

        # SET UP USER 1
        normal_user1 = get_user_model().objects.create_user(email='user1@example.com', password='wordpass',
                                                            full_name='user', address='')
        normal_user1.groups.add(guardian_group)
        login_response = self.client.post('/api/auth/login',
                                          json.dumps(
                                              {'email': 'user1@example.com', 'password': 'wordpass'}),
                                          content_type='application/json')
        self.user1_token = login_response.data['token']
        self.normal_user1 = normal_user1

        # SET UP USER 2
        normal_user2 = get_user_model().objects.create_user(email='user2@example.com', password='wordpass',
                                                            full_name='user', address='')
        normal_user2.groups.add(guardian_group)
        login_response = self.client.post('/api/auth/login',
                                          json.dumps(
                                              {'email': 'user2@example.com', 'password': 'wordpass'}),
                                          content_type='application/json')
        self.user2_token = login_response.data['token']

        school1 = School.objects.create(address='', name='School 1')
        school2 = School.objects.create(address='', name='School 2')
        school3 = School.objects.create(address='', name='School 3')
        school4 = School.objects.create(address='', name='School 4')
        route1 = Route.objects.create(name='School Route 1', description='', school=school1)
        route2 = Route.objects.create(name='School Route 2', description='', school=school2)
        route3 = Route.objects.create(name='School Route 3', description='', school=school3)
        route4 = Route.objects.create(name='School Route 4', description='', school=school4)

        # User 1 Children
        student1 = Student.objects.create(full_name='first last', address='', active=True,
                                          school=school1, routes=route1, guardian=normal_user1, student_id=1)
        student2 = Student.objects.create(full_name='first last', address='', active=True,
                                          school=school2, routes=route2, guardian=normal_user1, student_id=1)

        student3 = Student.objects.create(full_name='first last', address='', active=True,
                                          school=school3, routes=route3, guardian=normal_user1, student_id=1)
        # User 2 Children
        student4 = Student.objects.create(full_name='first last', address='', active=True,
                                          school=school4, routes=route4, guardian=normal_user2, student_id=1)
        self.factory = RequestFactory()
        self.client = Client()

    def test_admin_sees_all_students(self):
        response = self.client.get('/api/student/', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(len(response.data['results']), 4)

    def test_admin_sees_all_routes(self):
        response = self.client.get('/api/route/', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(len(response.data['results']), 4)

    def test_admin_sees_all_schools(self):
        response = self.client.get('/api/school/', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(len(response.data['results']), 4)

    def test_admin_sees_all_users(self):
        response = self.client.get('/api/user/', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(len(response.data['results']), 3)

    def test_user_only_sees_own_students(self):
        response = self.client.get('/api/student/', HTTP_AUTHORIZATION=f'Token {self.user1_token}')
        self.assertEqual(len(response.data['results']), 3)
        response = self.client.get('/api/student/', HTTP_AUTHORIZATION=f'Token {self.user2_token}')
        self.assertEqual(len(response.data['results']), 1)

    def test_user_only_sees_own_students_routes(self):
        response = self.client.get('/api/route/', HTTP_AUTHORIZATION=f'Token {self.user1_token}')
        self.assertEqual(len(response.data['results']), 3)
        response = self.client.get('/api/route/', HTTP_AUTHORIZATION=f'Token {self.user2_token}')
        self.assertEqual(len(response.data['results']), 1)

    def test_user_only_sees_own_students_schools(self):
        response = self.client.get('/api/school/', HTTP_AUTHORIZATION=f'Token {self.user1_token}')
        self.assertEqual(len(response.data['results']), 3)
        response = self.client.get('/api/school/', HTTP_AUTHORIZATION=f'Token {self.user2_token}')
        self.assertEqual(len(response.data['results']), 1)

    def test_guardian_only_sees_self(self):
        response = self.client.get('/api/user/', HTTP_AUTHORIZATION=f'Token {self.user1_token}')
        self.assertEqual(len(response.data['results']), 1)
        response = self.client.get('/api/user/', HTTP_AUTHORIZATION=f'Token {self.user2_token}')
        self.assertEqual(len(response.data['results']), 1)

    def test_guardians_cannot_write_student(self):
        response = self.client.post('/api/student/',
                                    json.dumps(
                                        {
                                            'full_name': 'first last',
                                            'address': '',
                                            'active': True,
                                            'school': 3,
                                            'student_id': 2,
                                            'routes': None,
                                            'guardian': 2
                                        }),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_guardians_cannot_write_route(self):
        response = self.client.post('/api/route/',
                                    json.dumps(
                                        {
                                            'name': 'route X',
                                            'description': '',
                                            'school': 4,
                                        }),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_guardians_cannot_write_school(self):
        response = self.client.post('/api/school/',
                                    json.dumps(
                                        {
                                            'name': 'new school',
                                            'address': '',
                                        }),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_guardian_can_still_read_students(self):
        student_id = self.normal_user1.students.values('id')[0]['id']
        response = self.client.get(f'/api/student/{student_id}/', HTTP_AUTHORIZATION=f'Token {self.user1_token}')
        self.assertEqual(response.status_code, 200)
