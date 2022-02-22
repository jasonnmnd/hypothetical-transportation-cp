import json
import datetime

from django.test import RequestFactory, TestCase, TransactionTestCase
from django.test import Client
from .models import Student, School, Route, Stop
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group


class TestStudentInRange(TransactionTestCase):
    reset_sequences = True

    def test_routes_without_students_are_complete(self):
        """
        Route 1 should be complete at the start
        :return: None
        """
        response = self.client.get('/api/route/1/', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.data['is_complete'], True)

    def setUp(self):
        """
        Test case has one student, one school, one route, and three stops
            Parent 1 + Student 1: Wilkinson Building (36.00352740209603, -78.93814858774756)
            Parent 1 + Student 2: Pitchforks (35.99934207787379, -78.93672453082038)
            School 1:
                Route 1:
                    Stop 1: Decker Tower (35.99855601792323, -78.93568366591728)
                    Stop 2: Perkins Library (36.002406773314895, -78.93857625780537)
                    Stop 3: Panda Express (36.00122851433393, -78.9405447866412)
        :return: None
        """
        self.wilkinson_loc = (36.00352740209603, -78.93814858774756)
        self.pitch_loc = (35.99934207787379, -78.93672453082038)
        self.decker_loc = (35.99855601792323, -78.93568366591728)
        self.perkins_loc = (36.002406773314895, -78.93857625780537)
        self.panda_loc = (36.00122851433393, -78.9405447866412)

        admin_group = Group.objects.create(name='Administrator')
        admin_user = get_user_model().objects.create_verified_user(email='admin@example.com', password='wordpass',
                                                                   full_name='admin user', address='loc0', latitude=0,
                                                                   longitude=0)
        admin_user.groups.add(admin_group)
        login_response = self.client.post('/api/auth/login',
                                          json.dumps(
                                              {'email': 'admin@example.com', 'password': 'wordpass'}),
                                          content_type='application/json')
        self.admin_token = login_response.data['token']
        self.admin_user = admin_user
        self.parent1 = get_user_model().objects.create_verified_user(email='user1@example.com',
                                                                     password='password',
                                                                     full_name='user', address='Wilkinson Building',
                                                                     latitude=self.wilkinson_loc[0],
                                                                     longitude=self.wilkinson_loc[1])
        self.parent2 = get_user_model().objects.create_verified_user(email='user2@example.com',
                                                                     password='password',
                                                                     full_name='user', address='Pitchforks',
                                                                     latitude=self.decker_loc[0],
                                                                     longitude=self.decker_loc[1])
        school = School.objects.create(address='dummy origin', longitude=0, latitude=0, name='example school')
        route = Route.objects.create(name='Route 1', description='', school=school)
        Stop.objects.create(name='Stop 1', location='Decker Tower', latitude=self.decker_loc[0],
                            longitude=self.decker_loc[1], route=route, pickup_time="00:00:00", dropoff_time="00:00:00",
                            stop_number=1)
        Stop.objects.create(name='Stop 2', location='Perkins Library', latitude=self.perkins_loc[0],
                            longitude=self.perkins_loc[1], route=route, pickup_time="00:00:00", dropoff_time="00:00:00",
                            stop_number=2)
        Stop.objects.create(name='Stop 3', location='Panda Express', latitude=self.panda_loc[0],
                            longitude=self.panda_loc[1], route=route, pickup_time="00:00:00", dropoff_time="00:00:00",
                            stop_number=3)

        Student.objects.create(full_name='student 1', active=True,
                               school=school, routes=None, guardian=self.parent1,
                               student_id=1)
        Student.objects.create(full_name='student 2', active=True,
                               school=school, routes=None, guardian=self.parent2,
                               student_id=2)


class TestModels(TestCase):

    def test_school_name(self):
        school = School.objects.create(address='', latitude=0, longitude=0, name='Test_School_Name')
        check_school_lower = School.objects.get(name='Test_School_name')
        check_school_upper = School.objects.get(name='Test_School_Name')
        self.assertEqual(check_school_lower, check_school_upper)

    def test_stop_dropoff_and_pickup(self):
        school = School.objects.create(
            address='2211 Hillsborough Road Durham, NC 27705',
            longitude=36.009121,
            latitude=-78.926017,
            name='Test Blank Stop Name',
            bus_arrival_time=datetime.time(9, 0, 0),
            bus_departure_time=datetime.time(16, 0, 0)
        )
        route = Route.objects.create(
            name='Test Blank Stop Name Route 1',
            description='test route',
            school=school,
        )
        route2 = route = Route.objects.create(
            name='Test Blank Stop Name Route 2',
            description='test route',
            school=school,
        )
        stop1 = Stop.objects.create(
            name='dummy 1',
            latitude=35.996996,
            longitude=-78.944668,
            stop_number=1,
            pickup_time="11:11:00",
            dropoff_time="12:11:00",
            route=route,
        )
        stop2 = Stop.objects.create(
            name='dummy 2',
            latitude=35.997663,
            longitude=-78.936984,
            stop_number=2,
            pickup_time="11:11:00",
            dropoff_time="12:11:00",
            route=route,
        )
        stops = Stop.objects.all()
        old_dropoff, old_pickup = [], []
        for stop in stops:
            print(f"stop_name: {stop.name}, dropoff time:{stop.dropoff_time}, pickup time:{stop.pickup_time}")
            old_dropoff.append(stop.dropoff_time)
            old_pickup.append(stop.pickup_time)
            self.assertIsNot(stop.dropoff_time, "12:11:00")
            self.assertIsNot(stop.pickup_time, "11:11:00")

        school.bus_arrival_time = datetime.time(10, 0, 0)
        school.bus_departure_time = datetime.time(17, 0, 0)
        school.save()

        old_dropoff2, old_pickup2 = [], []
        for stop in Stop.objects.all():
            old_dropoff2.append(stop.dropoff_time)
            old_pickup2.append(stop.pickup_time)
            if stop.dropoff_time in old_dropoff or stop.pickup_time in old_pickup:
                self.assertFalse

        # stops = Stop.objects.all()

        # for stop in Stop.objects.all():
        #     stop.longitude = stop.longitude+stop.latitude
        #     stop.latitude = stop.latitude
        #     stop.save()
        #     # print(f"OLD stop_name: {stop.name}, dropoff time:{stop.dropoff_time}, pickup time:{stop.pickup_time}")

        # for stop in Stop.objects.all():
        #     print(f"stop_name: {stop.name}, dropoff time:{stop.dropoff_time}, pickup time:{stop.pickup_time}")
        #     if stop.dropoff_time in old_dropoff2 or stop.pickup_time in old_pickup2:
        #         self.assertFalse


# Create your tests here.
class StopConsistency(TestCase):
    def setUp(self):
        self.parent1 = get_user_model().objects.create_verified_user(email='user1@example.com',
                                                                     password='password',
                                                                     full_name='user', address='example address',
                                                                     latitude=3.0, longitude=-0.8)
        self.parent2 = get_user_model().objects.create_verified_user(email='user2@example.com',
                                                                     password='password',
                                                                     full_name='user', address='example address',
                                                                     latitude=4.0, longitude=-2.0)
        self.school = School.objects.create(address='origin', longitude=0, latitude=0, name='example school')
        self.route1 = Route.objects.create(name='route 1', description='', school=self.school)
        self.stop4 = Stop.objects.create(name='', location='', latitude=1, longitude=0, route=self.route1,
                                         stop_number=4)
        self.stop3 = Stop.objects.create(name='', location='', latitude=2, longitude=0, route=self.route1,
                                         stop_number=3)
        self.stop2 = Stop.objects.create(name='', location='', latitude=3, longitude=0, route=self.route1,
                                         stop_number=2)
        self.stop1 = Stop.objects.create(name='', location='', latitude=4, longitude=0, route=self.route1,
                                         stop_number=1)
        self.student1 = Student.objects.create(full_name='student 1', active=True,
                                               school=self.school, routes=self.route1, guardian=self.parent1,
                                               student_id=1)

    # def test_closest_stop(self):
    #     print(self.stop4.pickup_time)
    #     print(self.stop3.pickup_time)
    #     print(self.stop2.pickup_time)
    #     print(self.stop1.pickup_time)
    #     print(self.stop4.dropoff_time)
    #     print(self.stop3.dropoff_time)
    #     print(self.stop2.dropoff_time)
    #     print(self.stop1.dropoff_time)
    #     print(self.student1.has_inrange_stop)


class AuthenticationObjectConsistency(TestCase):
    def setUp(self):
        admin_group = Group.objects.create(name='Administrator')
        guardian_group = Group.objects.create(name='Guardian')

        # SET UP ADMINISTRATOR
        admin_user = get_user_model().objects.create_verified_user(email='admin@example.com', password='wordpass',
                                                                   full_name='admin user', address='loc0', latitude=0,
                                                                   longitude=0)
        admin_user.groups.add(admin_group)
        # admin_user.is_verified = True

        login_response = self.client.post('/api/auth/login',
                                          json.dumps(
                                              {'email': 'admin@example.com', 'password': 'wordpass'}),
                                          content_type='application/json')
        self.admin_token = login_response.data['token']
        self.admin_user = admin_user

        stan = get_user_model().objects.create_verified_user(email='stanpines@mysteryshack.com',
                                                             password='mysteryshack',
                                                             full_name='Stanley Pines', address='618 Gopher Road',
                                                             latitude=0, longitude=0)
        dan = get_user_model().objects.create_verified_user(email='manlydan@gmail.com', password='wordpass',
                                                            full_name='Manly Dan', address='', latitude=0, longitude=0)
        school = School.objects.create(address='1111 Some St.', longitude=0, latitude=0, name='Eggbert Elementary')
        high_school = School.objects.create(address='7777 Some St.', longitude=0, latitude=0,
                                            name='Gravity Falls High School')
        route = Route.objects.create(name='School Route 1', description='', school=school)

        mabel = Student.objects.create(full_name='Mabel Pines', active=True,
                                       school=school, routes=route, guardian=stan, student_id=1)
        dipper = Student.objects.create(full_name='Dipper Pines',
                                        active=True, school=school, routes=route, guardian=stan, student_id=2)
        wendy = Student.objects.create(full_name='Wendy Corduroy', active=True,
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
                              'latitude': 0.0,
                              'longitude': 0.0,
                              'groups': [],
                              }),
                         content_type='application/json', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
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


class PermissionViews(TransactionTestCase):
    reset_sequences = True

    def setUp(self):
        admin_group = Group.objects.create(name='Administrator')
        guardian_group = Group.objects.create(name='Guardian')

        # SET UP ADMINISTRATOR
        admin_user = get_user_model().objects.create_verified_user(email='admin@example.com', password='wordpass',
                                                                   full_name='admin user', address='loc0', latitude=0,
                                                                   longitude=0)
        admin_user.groups.add(admin_group)

        # SET UP USER 1
        normal_user1 = get_user_model().objects.create_verified_user(email='user1@example.com', password='wordpass',
                                                                     full_name='user', address='loc1', latitude=0,
                                                                     longitude=0)
        normal_user1.groups.add(guardian_group)

        # SET UP USER 2
        normal_user2 = get_user_model().objects.create_verified_user(email='user2@example.com', password='wordpass',
                                                                     full_name='user', address='loc2', latitude=0,
                                                                     longitude=0)
        normal_user2.groups.add(guardian_group)
        self.normal_user2 = normal_user2

        school1 = School.objects.create(address='', latitude=0, longitude=0, name='School 1')
        school2 = School.objects.create(address='', latitude=0, longitude=0, name='School 2')
        school3 = School.objects.create(address='', latitude=0, longitude=0, name='School 3')
        school4 = School.objects.create(address='', latitude=0, longitude=0, name='School 4')
        route1 = Route.objects.create(name='School Route 1', description='', school=school1)
        route2 = Route.objects.create(name='School Route 2', description='', school=school2)
        route3 = Route.objects.create(name='School Route 3', description='', school=school3)
        route4 = Route.objects.create(name='School Route 4', description='', school=school4)

        # User 1 Children
        student1 = Student.objects.create(full_name='first last', active=True,
                                          school=school1, routes=route1, guardian=normal_user1, student_id=1)
        student2 = Student.objects.create(full_name='first last', active=True,
                                          school=school2, routes=route2, guardian=normal_user1, student_id=1)

        student3 = Student.objects.create(full_name='first last', active=True,
                                          school=school3, routes=route3, guardian=normal_user1, student_id=1)
        # User 2 Children
        student4 = Student.objects.create(full_name='first last', active=True,
                                          school=school4, routes=route4, guardian=normal_user2, student_id=1)

        login_response = self.client.post('/api/auth/login',
                                          json.dumps(
                                              {'email': 'admin@example.com', 'password': 'wordpass'}),
                                          content_type='application/json')
        self.admin_token = login_response.data['token']
        self.admin_user = admin_user

        login_response = self.client.post('/api/auth/login',
                                          json.dumps(
                                              {'email': 'user1@example.com', 'password': 'wordpass'}),
                                          content_type='application/json')
        self.user1_token = login_response.data['token']
        self.normal_user1 = normal_user1

        login_response = self.client.post('/api/auth/login',
                                          json.dumps(
                                              {'email': 'user2@example.com', 'password': 'wordpass'}),
                                          content_type='application/json')
        self.user2_token = login_response.data['token']

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
                                            'latitude': 0,
                                            'longitude': 0,
                                        }),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_guardian_can_still_read_students(self):
        student_id = self.normal_user1.students.values('id')[0]['id']
        response = self.client.get(f'/api/student/{student_id}/', HTTP_AUTHORIZATION=f'Token {self.user1_token}')
        self.assertEqual(response.status_code, 200)

    def test_admin_create_student_route_consistency(self):
        # Inconsistent routes forbidden
        response = self.client.post('/api/student/',
                                    json.dumps(
                                        {
                                            'full_name': 'first last',
                                            'active': True,
                                            'school': 1,
                                            'student_id': 2,
                                            'routes': 3,
                                            'guardian': 1,
                                        }),
                                    content_type='application/json',
                                    HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.status_code, 400)

        # Consistent routes allowed
        response = self.client.post('/api/student/',
                                    json.dumps(
                                        {
                                            'full_name': 'first last',
                                            'active': True,
                                            'school': 1,
                                            'student_id': 2,
                                            'routes': 1,
                                            'guardian': 1,
                                        }),
                                    content_type='application/json',
                                    HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.status_code, 201)

        # Prevent student from updating to some ridiculous route
        response = self.client.put('/api/student/2/',
                                   json.dumps(
                                       {
                                           'full_name': 'first last',
                                           'active': True,
                                           'school': 1,
                                           'student_id': 3,
                                           'routes': 3,
                                           'guardian': 1,
                                       }),
                                   content_type='application/json',
                                   HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(str(response.data['non_field_errors'][0]), 'Student school is not the same as student route!')
        self.assertEqual(response.status_code, 400)

        # Change other properties (Capitalization of name) is unaffected
        response = self.client.patch('/api/student/2/',
                                     json.dumps(
                                         {
                                             'full_name': 'Supercaulifloweragilistic'
                                         }),
                                     content_type='application/json',
                                     HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.status_code, 200)

    def test_guardian_needs_address(self):
        # SET UP ADDRESS-LESS USER 3
        normal_user3 = get_user_model().objects.create_verified_user(email='user3@example.com', password='wordpass',
                                                                     full_name='user', address='', latitude=0,
                                                                     longitude=0)
        response = self.client.post('/api/student/',
                                    json.dumps(
                                        {
                                            'full_name': 'first last',
                                            'active': True,
                                            'school': 1,
                                            'student_id': 4,
                                            'routes': 1,
                                            'guardian': 4,
                                        }),
                                    content_type='application/json',
                                    HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(str(response.data['non_field_errors'][0]), 'User does not have an address configured')
        self.assertEqual(response.status_code, 400)

    def test_admin_edit_user(self):
        response = self.client.put(f'/api/user/{self.normal_user2.id}/',
                                   json.dumps(
                                       {'email': 'user2@gmail.com',
                                        'full_name': 'Correct Name',
                                        'address': 'address',
                                        'latitude': 0,
                                        'longitude': 0,
                                        'groups': [],
                                        }),
                                   content_type='application/json',
                                   HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.status_code, 200)
        response = self.client.put(f'/api/user/{self.normal_user2.id}/',
                                   json.dumps(
                                       {'email': 'user2@gmail.com',
                                        'full_name': 'Should not be set',
                                        'address': 'address',
                                        'longitude': 0,
                                        'latitude': 0,
                                        'groups': [],
                                        }),
                                   content_type='application/json',
                                   HTTP_AUTHORIZATION=f'Token {self.user1_token}')
        self.assertEqual(response.status_code, 403)

        response = self.client.get(f'/api/user/{self.normal_user2.id}/', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.data['full_name'], 'Correct Name')

    def test_student_routes_guardian_optional(self):
        response = self.client.post('/api/student/',
                                    json.dumps(
                                        {
                                            'full_name': 'first last',
                                            'active': True,
                                            'school': 1,
                                            'student_id': 100,
                                            'routes': None,
                                            'guardian': None,
                                        }),
                                    content_type='application/json',
                                    HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(str(response.data['guardian'][0]), 'This field may not be null.')
        response = self.client.post('/api/student/',
                                    json.dumps(
                                        {
                                            'full_name': 'first last',
                                            'active': True,
                                            'school': 1,
                                            'student_id': 101,
                                            'routes': None,
                                            'guardian': 2,
                                        }),
                                    content_type='application/json',
                                    HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.status_code, 201)

    def test_post_address(self):
        response = self.client.post('/api/auth/register',
                                    json.dumps(
                                        {
                                            'email': 'bob@gmail.com',
                                            'full_name': 'bob smith',
                                            'password': 'wordpass',
                                            'address': '',
                                            'latitude': 0,
                                            'longitude': 0,
                                            'groups': [],
                                        }),
                                    content_type='application/json',
                                    HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.data['address'][0].code, 'blank')
