import json
import datetime

from django.test import RequestFactory, TestCase, TransactionTestCase
from django.test import Client
from .models import Student, School, Route, Stop
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from .geo_utils import get_straightline_distance
from .serializers import find_school_match_candidates, school_names_match
from django.core import mail
from django.test import tag


class TestStudentLoginAccount(TestCase):
    def setUp(self) -> None:
        self.loc = (36.00352740209603, -78.93814858774756)
        admin_group = Group.objects.create(name='Administrator')
        Group.objects.create(name='Student')
        self.admin = get_user_model().objects.create_verified_user(email='admin@example.com', password='wordpass',
                                                                   full_name='admin', address='Duke University',
                                                                   latitude=self.loc[0],
                                                                   longitude=self.loc[1])
        self.admin.groups.add(admin_group)
        login_response = self.client.post('/api/auth/login',
                                          json.dumps(
                                              {'email': 'admin@example.com', 'password': 'wordpass'}),
                                          content_type='application/json')
        self.admin_token = login_response.data['token']
        self.school = School.objects.create(address='Duke University', longitude=self.loc[0], latitude=self.loc[1],
                                            name='Duke University')

        response = self.client.post('/api/student/',
                                    json.dumps({
                                        'email': "student@example.com",
                                        'full_name': 'first last',
                                        'active': True,
                                        'school': self.school.pk,
                                        'student_id': None,
                                        'routes': None,
                                        'guardian': self.admin.pk
                                    }),
                                    content_type='application/json',
                                    HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.UNIQUE_FULL_NAME = "UNIQUE FULL NAME RESERVED"

    def test_post_student_with_email_creates_user_account(self):
        self.assertEqual(get_user_model().objects.count(), 2)

    def test_post_student_without_email_does_not_create_user_account(self):
        response = self.client.post('/api/student/',
                                    json.dumps({
                                        'full_name': self.UNIQUE_FULL_NAME,
                                        'active': True,
                                        'school': self.school.pk,
                                        'student_id': None,
                                        'routes': None,
                                        'guardian': self.admin.pk
                                    }),
                                    content_type='application/json',
                                    HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(get_user_model().objects.count(), 2)

    def test_update_student_email_to_none_deletes_account(self):
        response = self.client.put(f'/api/student/{Student.objects.get(email="student@example.com").id}/',
                                   json.dumps({
                                       'email': None,
                                       'full_name': 'Sam',
                                       'school': self.school.pk,
                                       'guardian': self.admin.pk,
                                   }),
                                   content_type='application/json',
                                   HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(get_user_model().objects.count(), 1)

    def test_update_student_email_to_not_none_creates_new_account(self):
        self.client.post('/api/student/',
                         json.dumps({
                             'full_name': self.UNIQUE_FULL_NAME,
                             'active': True,
                             'school': self.school.pk,
                             'student_id': None,
                             'routes': None,
                             'guardian': self.admin.pk,
                         }),
                         content_type='application/json',
                         HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(get_user_model().objects.count(), 2)
        self.client.put(f'/api/student/{Student.objects.get(full_name=self.UNIQUE_FULL_NAME).id}/',
                        json.dumps({
                            'email': "student2@example.com",
                            'full_name': 'first last',
                            'school': self.school.pk,
                            'guardian': self.admin.pk,
                        }),
                        content_type='application/json',
                        HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(get_user_model().objects.count(), 3)

    def test_update_student_also_updates_corresponding_user_account(self):
        NEW_FULL_NAME = 'last first'
        NEW_EMAIL = 'zstudents@example.com'
        student = Student.objects.get(email="student@example.com")
        response = self.client.put(f'/api/student/{student.id}/',
                                   json.dumps({
                                       'email': NEW_EMAIL,
                                       'full_name': NEW_FULL_NAME,
                                       'school': self.school.pk,
                                       'guardian': self.admin.pk,
                                   }),
                                   content_type='application/json',
                                   HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.status_code, 200)
        student_account = get_user_model().objects.get(email=NEW_EMAIL)
        self.assertEqual(student_account.email, NEW_EMAIL)
        self.assertEqual(student_account.full_name, NEW_FULL_NAME)

    def test_update_to_parent_also_updates_student(self):
        parent = get_user_model().objects.create_verified_user(email='parent@example.com', password='wordpass',
                                                               full_name='parent', address='Duke University',
                                                               latitude=self.loc[0],
                                                               longitude=self.loc[1])
        parent_group = Group.objects.create(name="Guardian")
        parent.groups.add(parent_group)
        response = self.client.post('/api/student/',
                                    json.dumps({
                                        'email': "student2@example.com",
                                        'full_name': 'first last',
                                        'active': True,
                                        'school': self.school.pk,
                                        'student_id': None,
                                        'routes': None,
                                        'guardian': parent.id
                                    }),
                                    content_type='application/json',
                                    HTTP_AUTHORIZATION=f'Token {self.admin_token}')

        address = ["4932 Stoney Creek Dr., Rapid City, SD", 44.0354113538215, -103.27045120181496]
        response = self.client.patch(f'/api/user/{parent.id}/',
                                     json.dumps({
                                         "address": address[0],
                                         "latitude": address[1],
                                         "longitude": address[2],
                                     }),
                                     content_type='application/json',
                                     HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        student_account = get_user_model().objects.get(email="student2@example.com")
        # self.assertEqual(student_account.address, address[0])
        # self.assertEqual(student_account.latitude, address[1])
        # self.assertEqual(student_account.longitude, address[2])
        self.assertIs(student_account.address, None)
        self.assertIs(student_account.latitude, None)
        self.assertIs(student_account.longitude, None)


class TestBulkImport(TestCase):
    def setUp(self) -> None:
        """
        Small prepopulated database that tests error handling of bulk import
        admin@example.com
        user1@example.com: John Smith
            student: Charlie Smith
            student: Carson Smith
        user2@example.com: John Smith
        """
        self.loc = (36.00352740209603, -78.93814858774756)
        admin_group = Group.objects.create(name='Administrator')
        parent_group = Group.objects.create(name='Guardian')

        self.admin = get_user_model().objects.create_verified_user(email='admin@example.com', password='wordpass',
                                                                   full_name='admin', address='Duke University',
                                                                   latitude=self.loc[0],
                                                                   longitude=self.loc[1])
        self.admin.groups.add(admin_group)
        login_response = self.client.post('/api/auth/login',
                                          json.dumps(
                                              {'email': 'admin@example.com', 'password': 'wordpass'}),
                                          content_type='application/json')
        self.admin_token = login_response.data['token']
        parent_1 = get_user_model().objects.create_verified_user(email='user1@example.com', password='wordpass',
                                                                 full_name='John Smith', address='Duke University',
                                                                 latitude=self.loc[0], longitude=self.loc[1])
        get_user_model().objects.create_verified_user(email='user2@example.com', password='wordpass',
                                                      full_name='John Smith', address='Duke University',
                                                      latitude=self.loc[0], longitude=self.loc[1])
        school_1 = School.objects.create(address='Duke University', longitude=self.loc[0], latitude=self.loc[1],
                                         name='Duke    University')
        Student.objects.create(full_name='Charlie Smith', active=True,
                               school=school_1, routes=None, guardian=parent_1,
                               student_id=None)
        Student.objects.create(full_name='Carson Smith', active=True,
                               school=school_1, routes=None, guardian=parent_1,
                               student_id=None)

    def test_school_staff_student_post_handling(self):
        inside_school = School.objects.create(address='Duke University, Durham NC', longitude=self.loc[0],
                                              latitude=self.loc[1],
                                              name='Staff Managed School')
        staff_group = Group.objects.create(name="SchoolStaff")
        staff = get_user_model().objects.create_verified_user(email='staff@example.com', password='wordpass',
                                                              full_name='staff', address='Duke University',
                                                              latitude=self.loc[0],
                                                              longitude=self.loc[1])
        staff.groups.add(staff_group)
        staff.managed_schools.add(inside_school)
        login_response = self.client.post('/api/auth/login',
                                          json.dumps(
                                              {'email': 'staff@example.com', 'password': 'wordpass'}),
                                          content_type='application/json')
        staff_token = login_response.data['token']
        loaded_data = {
            "users": [],
            "students": [
                {
                    "full_name": "Ronaldo Smith",
                    "student_id": None,
                    "parent_email": "user1@example.com",
                    "school_name": "duke university"
                }
            ]
        }
        response = self.client.post('/api/loaded-data/validate/', json.dumps(loaded_data),
                                    content_type='application/json', HTTP_AUTHORIZATION=f'Token {staff_token}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(str(response.data['students'][0]['school_name']['error'][0]),
                         'Student would be assigned to school you do not manage')

        response = self.client.post('/api/loaded-data/', json.dumps(loaded_data),
                                    content_type='application/json', HTTP_AUTHORIZATION=f'Token {staff_token}')
        self.assertEqual(response.status_code, 400)

        loaded_data = {
            "users": [],
            "students": [
                {
                    "full_name": "Ronaldo Smith",
                    "student_id": None,
                    "parent_email": "user1@example.com",
                    "school_name": "staff managed school"
                }
            ]
        }
        response = self.client.post('/api/loaded-data/validate/', json.dumps(loaded_data),
                                    content_type='application/json', HTTP_AUTHORIZATION=f'Token {staff_token}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['students'][0]['school_name']['error']), 0)

        response = self.client.post('/api/loaded-data/', json.dumps(loaded_data),
                                    content_type='application/json', HTTP_AUTHORIZATION=f'Token {staff_token}')
        self.assertEqual(response.status_code, 201)

    def test_non_conflict_post(self):
        loaded_data = {
            "users": [
                {
                    "email": "user3@example.com",
                    "full_name": "Sam Smith",
                    "address": "4932 Stoney Creek Dr., Rapid City SD",
                    "phone_number": "9999999999"
                }
            ],
            "students": [
                {
                    "full_name": "Ronaldo Smith",
                    "student_id": 3,
                    "parent_email": "user1@example.com",
                    "school_name": "duke university"
                }
            ]
        }
        response = self.client.post('/api/loaded-data/', json.dumps(loaded_data),
                                    content_type='application/json', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.status_code, 201)

    def test_location_assistance(self):
        loaded_data = {
            "users": [
                {
                    "email": "user3@example.com",
                    "full_name": "Sam Smith",
                    "address": "asdfasjdklfa;jsdfl;kajdf",
                    "phone_number": "9999999999"
                }
            ],
            "students": []
        }
        response = self.client.post('/api/loaded-data/validate/', json.dumps(loaded_data),
                                    content_type='application/json', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Address could not be geographically matched', response.data['users'][0]['address']['error'])

    def test_address_timeout(self):
        loaded_data = {
            "users": [
                {
                    "email": "user10@example.com",
                    "full_name": "Sam Smith",
                    "address": "510 West Main St.",
                    "phone_number": "9999999999"
                }
            ],
            "students": []
        }
        response = self.client.post('/api/loaded-data/validate/', json.dumps(loaded_data),
                                    content_type='application/json', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.status_code, 200)

    def test_school_matching(self):
        loaded_data = {
            "users": [],
            "students": [
                {
                    "full_name": "Samwell Smith",
                    "student_id": 2,
                    "parent_email": "user1@example.com",
                    "school_name": "duk university"
                }
            ]
        }
        response = self.client.post('/api/loaded-data/validate/', json.dumps(loaded_data),
                                    content_type='application/json', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.status_code, 200)
        self.assertIn('School name could not be matched', response.data['students'][0]['school_name']['error'])

    def test_validation_checks_student_email(self):
        loaded_data = {
            "users": [
                {
                    "email": "user7@example.com",
                    "full_name": "Sam Smith",
                    "address": "510 West Main St.",
                    "phone_number": "9999999999"
                }
            ],
            "students": [
                {
                    "email": "user7@example.com",
                    "phone_number": "999999999",
                    "full_name": "Samwell Smith",
                    "student_id": 2,
                    "parent_email": "user1@example.com",
                    "school_name": "duke university"
                }
            ]
        }
        response = self.client.post('/api/loaded-data/validate/', json.dumps(loaded_data),
                                    content_type='application/json', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.data['users'][0]['email']['error'][0],
                         'Duplicate email addresses must be corrected before continuing')
        self.assertEqual(response.data['students'][0]['email']['error'][0],
                         'Duplicate email addresses must be corrected before continuing')

    def test_student_email_duplication_checking(self):
        loaded_data = {
            "users": [],
            "students": [
                {
                    "email": "user7@example.com",
                    "phone_number": "999999999",
                    "full_name": "Samwell Smith",
                    "student_id": 2,
                    "parent_email": "user1@example.com",
                    "school_name": "duke university"
                },
                {
                    "email": "user7@example.com",
                    "phone_number": "999999999",
                    "full_name": "Samwell Smith",
                    "student_id": 2,
                    "parent_email": "user1@example.com",
                    "school_name": "duke university"
                },
                {
                    "email": "user7@example.com",
                    "phone_number": "999999999",
                    "full_name": "Samwell Smith",
                    "student_id": 2,
                    "parent_email": "user1@example.com",
                    "school_name": "duke university"
                },
            ]
        }
        response = self.client.post('/api/loaded-data/validate/', json.dumps(loaded_data),
                                    content_type='application/json', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(len(response.data['students'][0]['email']['duplicates']), 2)
        self.assertEqual(len(response.data['students'][1]['email']['duplicates']), 2)
        self.assertEqual(len(response.data['students'][2]['email']['duplicates']), 2)

    def test_student_no_email_submission(self):
        loaded_data = {
            "users": [],
            "students": [
                {
                    "email": None,
                    "phone_number": "999999999",
                    "full_name": "Samwell Smith",
                    "student_id": 2,
                    "parent_email": "user1@example.com",
                    "school_name": "duke university"
                },
            ]}
        response = self.client.post('/api/loaded-data/', json.dumps(loaded_data),
                                    content_type='application/json', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(get_user_model().objects.filter(email="user7@example.com").count(), 0)

        loaded_data = {
            "users": [],
            "students": [
                {
                    "email": "",
                    "phone_number": "999999999",
                    "full_name": "Samwell Smith",
                    "student_id": 2,
                    "parent_email": "user1@example.com",
                    "school_name": "duke university"
                },
            ]}
        response = self.client.post('/api/loaded-data/', json.dumps(loaded_data),
                                    content_type='application/json', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(get_user_model().objects.filter(email="user7@example.com").count(), 0)

    def test_student_with_email_submission(self):
        loaded_data = {
            "users": [],
            "students": [
                {
                    "email": "user7@example.com",
                    "phone_number": "999999999",
                    "full_name": "Samwell Smith",
                    "student_id": 2,
                    "parent_email": "user1@example.com",
                    "school_name": "duke university"
                },
            ]}
        response = self.client.post('/api/loaded-data/', json.dumps(loaded_data),
                                    content_type='application/json', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(get_user_model().objects.filter(email="user7@example.com").count(), 1)
        linked_student = get_user_model().objects.get(email="user7@example.com").linked_student
        self.assertEqual(linked_student.email, "user7@example.com")

    def test_user_name_duplication(self):
        loaded_data = {
            "users": [
                {
                    "email": "user3@example.com",
                    "full_name": "John Smith",
                    "address": "4932 Stoney Creek Dr.",
                    "phone_number": "9999999999"
                },
                {
                    "email": "user4@example.com",
                    "full_name": "John Smith",
                    "address": "4932 Stoney Creek Dr.",
                    "phone_number": "9999999999"
                },
            ],
            "students": []
        }
        response = self.client.post('/api/loaded-data/validate/', json.dumps(loaded_data),
                                    content_type='application/json', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['users'][0]['full_name']['duplicates']), 3)

    def test_student_name_duplication_inout_db(self):
        loaded_data = {
            "users": [],
            "students": [
                {
                    "full_name": "Carson Smith",
                    "student_id": 3,
                    "parent_email": "user1@example.com",
                    "school_name": "duke university"
                },
                {
                    "full_name": "Carson Smith",
                    "student_id": 3,
                    "parent_email": "user1@example.com",
                    "school_name": "duke university"
                },
            ]
        }
        response = self.client.post('/api/loaded-data/validate/', json.dumps(loaded_data),
                                    content_type='application/json', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['students'][0]['full_name']['duplicates']), 2)

    def test_user_email_duplication(self):
        loaded_data = {
            "users": [
                {
                    "email": "user1@example.com",
                    "full_name": "John Smith",
                    "address": "4932 Stoney Creek Dr.",
                    "phone_number": "9999999999"
                }
            ],
            "students": []
        }
        response = self.client.post('/api/loaded-data/validate/', json.dumps(loaded_data),
                                    content_type='application/json', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['users'][0]['email']['duplicates']), 1)

    def test_submission_breaking_user_is_atomic(self):
        loaded_data = {
            "users": [
                {
                    "email": "user3@example.com",
                    "full_name": "John Smith",
                    "address": "4932 Stoney Creek Dr.",
                    "phone_number": "9999999999"
                },
                {
                    "email": "user4@example.com",
                    "full_name": "John Smith",
                    "address": "4932 Stoney Creek Dr.",
                    "phone_number": "9999999999"
                },
                {
                    "email": "user5@example.com",
                    "full_name": "John Smith",
                    "address": "4932 Stoney Creek Dr.",
                    "phone_number": "9999999999"
                },
                {
                    "email": "user1@example.com",
                    "full_name": "John Smith",
                    "address": "4932 Stoney Creek Dr.",
                    "phone_number": "9999999999"
                },
            ],
            "students": []
        }
        response = self.client.post('/api/loaded-data/', json.dumps(loaded_data),
                                    content_type='application/json', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(get_user_model().objects.count(), 3)
        self.assertEqual(Student.objects.count(), 2)

    def test_submission_breaking_student_is_atomic(self):
        loaded_data = {
            "users": [
                {
                    "email": "user3@example.com",
                    "full_name": "John Smith",
                    "address": "4932 Stoney Creek Dr.",
                    "phone_number": "9999999999"
                },
                {
                    "email": "user4@example.com",
                    "full_name": "John Smith",
                    "address": "4932 Stoney Creek Dr.",
                    "phone_number": "9999999999"
                },
                {
                    "email": "user5@example.com",
                    "full_name": "John Smith",
                    "address": "4932 Stoney Creek Dr.",
                    "phone_number": "9999999999"
                },
                {
                    "email": "user6@example.com",
                    "full_name": "John Smith",
                    "address": "4932 Stoney Creek Dr.",
                    "phone_number": "9999999999"
                },
            ],
            "students": [
                {
                    "full_name": "Carson Smith",
                    "student_id": None,
                    "parent_email": "user10@example.com",
                    "school_name": "duke university"
                }
            ]
        }
        response = self.client.post('/api/loaded-data/', json.dumps(loaded_data),
                                    content_type='application/json', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(get_user_model().objects.count(), 3)
        self.assertEqual(Student.objects.count(), 2)

    def test_successful_transaction_large(self):
        loaded_data = {
            "users": [
                {
                    "email": "user3@example.com",
                    "full_name": "John Smith",
                    "address": "4932 Stoney Creek Dr., Rapid City, SD",
                    "phone_number": "9999999999"
                },
                {
                    "email": "user4@example.com",
                    "full_name": "John Smith",
                    "address": "4932 Stoney Creek Dr., Rapid City, SD",
                    "phone_number": "9999999999"
                },
                {
                    "email": "user5@example.com",
                    "full_name": "John Smith",
                    "address": "4932 Stoney Creek Dr., Rapid City, SD",
                    "phone_number": "9999999999"
                },
                {
                    "email": "user6@example.com",
                    "full_name": "John Smith",
                    "address": "4932 Stoney Creek Dr., Rapid City, SD",
                    "phone_number": "9999999999"
                },
            ],
            "students": [
                {
                    "full_name": "Carson Smith",
                    "student_id": None,
                    "parent_email": "user1@example.com",
                    "school_name": "duke university"
                },
                {
                    "full_name": "Carson Smith",
                    "student_id": None,
                    "parent_email": "user1@example.com",
                    "school_name": "duke university"
                },
                {
                    "full_name": "Carson Smith",
                    "student_id": None,
                    "parent_email": "user1@example.com",
                    "school_name": "duke university"
                },
            ]
        }
        response = self.client.post('/api/loaded-data/', json.dumps(loaded_data),
                                    content_type='application/json', HTTP_AUTHORIZATION=f'Token {self.admin_token}')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(get_user_model().objects.count(), 7)
        self.assertEqual(Student.objects.count(), 5)


class TestGroupViewFiltering(TransactionTestCase):
    """
    This test suite examines the access permissions of new user groups in evolution 3
    """

    reset_sequences = True

    def setUp(self) -> None:
        """
        Test case has one student, one school, one route, and three stops.  All locations are the same

        Users:
        driver_1
        school_staff_1
        school_staff_2
        parent_1: student_1, student_2
        parent_2: student_3
        parent_3: student_4

        school_1:
            staff: school_staff_1, school_staff_2
            route_1: student_1
                stop_1
            route_2:
                stop_2
        school_2:
            staff: school_staff_1
            route_3: student_3, student_2
                stop_3:
        school_3:
            staff: None
            route_4: student_4
                stop_4:

        :return:  None
        """
        # Location of Wilkinson building

        self.loc = (36.00352740209603, -78.93814858774756)

        parent_group = Group.objects.create(name='Guardian')
        staff_group = Group.objects.create(name='SchoolStaff')
        driver_group = Group.objects.create(name='Driver')

        self.driver_1 = get_user_model().objects.create_verified_user(email='driver1@example.com', password='wordpass',
                                                                      full_name='driver 1', address='Duke University',
                                                                      latitude=self.loc[0],
                                                                      longitude=self.loc[1])
        self.driver_1.groups.add(driver_group)
        login_response = self.client.post('/api/auth/login',
                                          json.dumps(
                                              {'email': 'driver1@example.com', 'password': 'wordpass'}),
                                          content_type='application/json')
        self.driver_1_token = login_response.data['token']

        self.school_staff_1 = get_user_model().objects.create_verified_user(email='staff1@example.com',
                                                                            password='wordpass',
                                                                            full_name='staff 1',
                                                                            address='Duke University',
                                                                            latitude=self.loc[0],
                                                                            longitude=self.loc[1])
        self.school_staff_1.groups.add(staff_group)
        login_response = self.client.post('/api/auth/login',
                                          json.dumps(
                                              {'email': 'staff1@example.com', 'password': 'wordpass'}),
                                          content_type='application/json')
        self.staff_1_token = login_response.data['token']

        self.school_staff_2 = get_user_model().objects.create_verified_user(email='staff2@example.com',
                                                                            password='wordpass',
                                                                            full_name='staff 2',
                                                                            address='Duke University',
                                                                            latitude=self.loc[0],
                                                                            longitude=self.loc[1])
        self.school_staff_2.groups.add(staff_group)
        login_response = self.client.post('/api/auth/login',
                                          json.dumps(
                                              {'email': 'staff2@example.com', 'password': 'wordpass'}),
                                          content_type='application/json')
        self.staff_2_token = login_response.data['token']

        self.parent_1 = get_user_model().objects.create_verified_user(email='parent1@gmail.com',
                                                                      password='password',
                                                                      full_name='parent 1', address='Duke University',
                                                                      latitude=self.loc[0], longitude=self.loc[1])
        self.parent_1.groups.add(parent_group)
        self.parent_2 = get_user_model().objects.create_verified_user(email='parent2@gmail.com',
                                                                      password='password',
                                                                      full_name='parent 2', address='Duke University',
                                                                      latitude=self.loc[0], longitude=self.loc[1])
        self.parent_2.groups.add(parent_group)
        self.parent_3 = get_user_model().objects.create_verified_user(email='parent3@gmail.com',
                                                                      password='password',
                                                                      full_name='parent 3', address='Duke University',
                                                                      latitude=self.loc[0], longitude=self.loc[1])
        self.parent_3.groups.add(parent_group)

        school_1 = School.objects.create(address='Duke University', longitude=self.loc[0], latitude=self.loc[1],
                                         name='school 1')
        school_2 = School.objects.create(address='Duke University', longitude=self.loc[0], latitude=self.loc[1],
                                         name='school 2')
        school_3 = School.objects.create(address='Duke University', longitude=self.loc[0], latitude=self.loc[1],
                                         name='school 3')

        route_1 = Route.objects.create(name='route 1', description='', school=school_1)
        route_2 = Route.objects.create(name='route 2', description='', school=school_1)
        route_3 = Route.objects.create(name='route 3', description='', school=school_2)
        route_4 = Route.objects.create(name='route 4', description='', school=school_3)

        Student.objects.create(full_name='student 1', active=True,
                               school=school_1, routes=route_1, guardian=self.parent_1,
                               student_id=None)
        Student.objects.create(full_name='student 2', active=True,
                               school=school_2, routes=route_3, guardian=self.parent_1,
                               student_id=None)
        Student.objects.create(full_name='student 3', active=True,
                               school=school_2, routes=route_3, guardian=self.parent_2,
                               student_id=None)
        Student.objects.create(full_name='student 4', active=True,
                               school=school_3, routes=route_4, guardian=self.parent_3,
                               student_id=None)

        Stop.objects.create(name='stop 1', latitude=self.loc[0], longitude=self.loc[1], stop_number=1,
                            pickup_time="11:11:00", dropoff_time="12:11:00", route=route_1)
        Stop.objects.create(name='stop 2', latitude=self.loc[0], longitude=self.loc[1], stop_number=1,
                            pickup_time="11:11:00", dropoff_time="12:11:00", route=route_2)
        Stop.objects.create(name='stop 3', latitude=self.loc[0], longitude=self.loc[1], stop_number=1,
                            pickup_time="11:11:00", dropoff_time="12:11:00", route=route_3)
        Stop.objects.create(name='stop 4', latitude=self.loc[0], longitude=self.loc[1], stop_number=1,
                            pickup_time="11:11:00", dropoff_time="12:11:00", route=route_4)

        self.school_staff_1.managed_schools.add(school_1)
        self.school_staff_1.managed_schools.add(school_2)
        self.school_staff_2.managed_schools.add(school_1)

    def test_school_list_permissions(self):
        """
        Driver should be able to view all schools, staff 1 should be able to see 2, and staff 2 should only be able to
        see one school.
        """
        response = self.client.get('/api/school/', HTTP_AUTHORIZATION=f'Token {self.driver_1_token}')
        self.assertEqual(response.data['count'], 3)
        response = self.client.get('/api/school/', HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.data['count'], 2)
        response = self.client.get('/api/school/', HTTP_AUTHORIZATION=f'Token {self.staff_2_token}')
        self.assertEqual(response.data['count'], 1)

    def test_route_list_permissions(self):
        response = self.client.get('/api/route/', HTTP_AUTHORIZATION=f'Token {self.driver_1_token}')
        self.assertEqual(response.data['count'], 4)
        response = self.client.get('/api/route/', HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.data['count'], 3)
        response = self.client.get('/api/route/', HTTP_AUTHORIZATION=f'Token {self.staff_2_token}')
        self.assertEqual(response.data['count'], 2)

    def test_stop_list_permissions(self):
        response = self.client.get('/api/stop/', HTTP_AUTHORIZATION=f'Token {self.driver_1_token}')
        self.assertEqual(response.data['count'], 4)
        response = self.client.get('/api/stop/', HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.data['count'], 3)
        response = self.client.get('/api/stop/', HTTP_AUTHORIZATION=f'Token {self.staff_2_token}')
        self.assertEqual(response.data['count'], 2)

    def test_student_list_permissions(self):
        response = self.client.get('/api/student/', HTTP_AUTHORIZATION=f'Token {self.driver_1_token}')
        self.assertEqual(response.data['count'], 4)
        response = self.client.get('/api/student/', HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.data['count'], 3)
        response = self.client.get('/api/student/', HTTP_AUTHORIZATION=f'Token {self.staff_2_token}')
        self.assertEqual(response.data['count'], 1)

    def test_parent_list_permissions(self):
        # Driver can also see other users
        response = self.client.get('/api/user/', HTTP_AUTHORIZATION=f'Token {self.driver_1_token}')
        self.assertEqual(response.data['count'], 6)
        response = self.client.get('/api/user/', HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.data['count'], 2)
        response = self.client.get('/api/user/', HTTP_AUTHORIZATION=f'Token {self.staff_2_token}')
        self.assertEqual(response.data['count'], 1)

    def test_staff_cannot_delete_school(self):
        response = self.client.delete('/api/school/1/', HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.status_code, 403)

    def test_staff_can_delete_assoc_student(self):
        response = self.client.delete('/api/student/1/', HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.status_code, 204)
        response = self.client.delete('/api/student/4/', HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.status_code, 404)

    def test_staff_can_delete_assoc_route(self):
        response = self.client.delete('/api/route/1/', HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.status_code, 204)
        response = self.client.delete('/api/route/2/', HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.status_code, 204)
        response = self.client.delete('/api/route/3/', HTTP_AUTHORIZATION=f'Token {self.staff_2_token}')
        self.assertEqual(response.status_code, 404)
        response = self.client.delete('/api/route/3/', HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.status_code, 204)
        response = self.client.delete('/api/route/3/', HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.status_code, 404)

    def test_admin_cannot_revoke_own_group(self):
        admin_group = Group.objects.create(name="Administrator")
        admin = get_user_model().objects.create_verified_user(email='admin@example.com', password='wordpass',
                                                              full_name='admin', address='Duke University',
                                                              latitude=self.loc[0],
                                                              longitude=self.loc[1])
        admin.groups.add(admin_group)
        login_response = self.client.post('/api/auth/login',
                                          json.dumps(
                                              {'email': 'admin@example.com', 'password': 'wordpass'}),
                                          content_type='application/json')
        admin_token = login_response.data['token']
        response = self.client.patch(f'/api/user/{admin.id}/',
                                     json.dumps({"groups": [Group.objects.get(name="SchoolStaff").id]}),
                                     content_type='application/json',
                                     HTTP_AUTHORIZATION=f'Token {admin_token}')
        self.assertEqual(response.status_code, 400)

    def test_staff_user_delete_on_all_students(self):
        """
        Tests that staff can only delete a user if all children of that user attend schools within that staff's managed
        schools.
        :return: None
        """
        response = self.client.delete(f'/api/user/{self.parent_1.id}/',
                                      HTTP_AUTHORIZATION=f'Token {self.staff_2_token}')
        self.assertEqual(response.status_code, 400)
        response = self.client.delete(f'/api/user/{self.parent_1.id}/',
                                      HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.status_code, 204)

    def test_staff_cannot_delete_privileged_user(self):
        self.parent_1.groups.clear()
        self.parent_1.groups.add(Group.objects.get(name='SchoolStaff'))
        response = self.client.delete(f'/api/user/{self.parent_1.id}/',
                                      HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.status_code, 400)

    def test_staff_cannot_send_email_to_all(self):
        response = self.client.post('/api/communication/send-announcement',
                                    json.dumps(
                                        {
                                            "object_id": 1,
                                            "id_type": "ALL",
                                            "subject": "General Announcement",
                                            "body": "Body Example"
                                        }
                                    ),
                                    content_type='application/json',
                                    HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.status_code, 400)
        response = self.client.post('/api/communication/send-route-announcement',
                                    json.dumps(
                                        {
                                            "id_type": "ALL",
                                            "subject": "Route Announcement (ALL)",
                                            "body": "Body Example"
                                        }
                                    ),
                                    content_type='application/json',
                                    HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.status_code, 400)

    def test_staff_cannot_send_email_to_outside_route(self):
        route_4 = Route.objects.get(name="route 4")
        response = self.client.post('/api/communication/send-announcement',
                                    json.dumps(
                                        {
                                            "object_id": route_4.id,
                                            "id_type": "ROUTE",
                                            "subject": "General (Route) Announcement",
                                            "body": "Body Example"
                                        }
                                    ),
                                    content_type='application/json',
                                    HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['detail'], 'This email is not permitted.  Please check your managed schools')

    def test_staff_can_send_email_to_route(self):
        route_3 = Route.objects.get(name="route 3")
        response = self.client.post('/api/communication/send-announcement',
                                    json.dumps(
                                        {
                                            "object_id": route_3.id,
                                            "id_type": "ROUTE",
                                            "subject": "General (Route) Announcement",
                                            "body": "Body Example"
                                        }
                                    ),
                                    content_type='application/json',
                                    HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(len(response.data['recipients']), 2)

        mail.outbox = []
        response = self.client.post('/api/communication/send-route-announcement',
                                    json.dumps(
                                        {
                                            "object_id": route_3.id,
                                            "id_type": "ROUTE",
                                            "subject": "Route (Route) Announcement",
                                            "body": "Body Example"
                                        }
                                    ),
                                    content_type='application/json',
                                    HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(len(mail.outbox), 2)

    def test_staff_cannot_send_email_to_outside_school(self):
        school_3 = School.objects.get(name="school 3")
        response = self.client.post('/api/communication/send-announcement',
                                    json.dumps(
                                        {
                                            "object_id": school_3.id,
                                            "id_type": "SCHOOL",
                                            "subject": "General (School) Announcement",
                                            "body": "Body Example"
                                        }
                                    ),
                                    content_type='application/json',
                                    HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.status_code, 400)
        response = self.client.post('/api/communication/send-route-announcement',
                                    json.dumps(
                                        {
                                            "object_id": school_3.id,
                                            "id_type": "SCHOOL",
                                            "subject": "Route (School) Announcement",
                                            "body": "Body Example"
                                        }
                                    ),
                                    content_type='application/json',
                                    HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.status_code, 400)

    def test_staff_can_send_email_to_managed_schools(self):
        school_1 = School.objects.get(name="school 1")
        school_2 = School.objects.get(name="school 2")
        response = self.client.post('/api/communication/send-announcement',
                                    json.dumps(
                                        {
                                            "object_id": school_1.id,
                                            "id_type": "SCHOOL",
                                            "subject": "General (School) Announcement",
                                            "body": "Body Example"
                                        }
                                    ),
                                    content_type='application/json',
                                    HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)

        mail.outbox = []
        response = self.client.post('/api/communication/send-route-announcement',
                                    json.dumps(
                                        {
                                            "object_id": school_1.id,
                                            "id_type": "SCHOOL",
                                            "subject": "Route (School) Announcement",
                                            "body": "Body Example"
                                        }
                                    ),
                                    content_type='application/json',
                                    HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)

        mail.outbox = []
        response = self.client.post('/api/communication/send-announcement',
                                    json.dumps(
                                        {
                                            "object_id": school_2.id,
                                            "id_type": "SCHOOL",
                                            "subject": "General (School) Announcement",
                                            "body": "Body Example"
                                        }
                                    ),
                                    content_type='application/json',
                                    HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['recipients']), 2)
        self.assertEqual(len(mail.outbox), 1)

        mail.outbox = []
        response = self.client.post('/api/communication/send-route-announcement',
                                    json.dumps(
                                        {
                                            "object_id": school_2.id,
                                            "id_type": "SCHOOL",
                                            "subject": "Route (School) Announcement",
                                            "body": "Body Example"
                                        }
                                    ),
                                    content_type='application/json',
                                    HTTP_AUTHORIZATION=f'Token {self.staff_1_token}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 2)


class TestMatchingUtilities(TestCase):
    def setUp(self):
        self.wilkinson_loc = (36.00352740209603, -78.93814858774756)
        school = School.objects.create(address='Duke University', longitude=self.wilkinson_loc[0],
                                       latitude=self.wilkinson_loc[1], name='abcd efgh ijkl')
        school = School.objects.create(address='Duke University', longitude=self.wilkinson_loc[0],
                                       latitude=self.wilkinson_loc[1], name='ABCD xyz')

    def test_case_insensitive(self):
        self.assertEqual(find_school_match_candidates('   abCd   ').count(), 2)
        self.assertEqual(find_school_match_candidates('   abCd   efGh   ').count(), 1)
        self.assertEqual(find_school_match_candidates('   efGh  abcD ').count(), 1)
        self.assertEqual(find_school_match_candidates('   xyz   ').count(), 1)

    def test_matching(self):
        self.assertTrue(school_names_match(" AbC   dEf", "aBc def"))
        self.assertFalse(school_names_match(" AbC   dEf g", "aBc def"))


class TestMultipleStopDelete(TransactionTestCase):
    reset_sequences = True

    def setUp(self):
        self.wilkinson_loc = (36.00352740209603, -78.93814858774756)
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

        school = School.objects.create(address='Duke University', longitude=self.wilkinson_loc[0],
                                       latitude=self.wilkinson_loc[1], name='example school')
        route = Route.objects.create(name='Route 1', description='', school=school)
        for stop_num in range(1, 9):
            Stop.objects.create(name='Stop 1', location='Decker Tower', latitude=self.wilkinson_loc[0],
                                longitude=self.wilkinson_loc[1], route=route, pickup_time="00:00:00",
                                dropoff_time="00:00:00",
                                stop_number=stop_num)

    def test_mass_stop_deletion(self):
        for stop_num in range(1, 9):
            self.client.delete(f'/api/stop/{stop_num}/', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        response = self.client.get('/api/stop/', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.data['count'], 0)


class TestStudentInRange(TransactionTestCase):
    reset_sequences = True

    def test_route_all_students_have_inrange(self):
        """
        All students are required to have an in-range stop for the route to be complete.  If Decker tower is removed,
        only student 1 haas an in-range stop, and the route becomes incomplete.

        :return: None
        """

        self.client.delete('/api/stop/1/', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        student_response = self.client.get('/api/student/1/', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(student_response.data['has_inrange_stop'], True)
        student_response = self.client.get('/api/student/2/', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(student_response.data['has_inrange_stop'], False)
        response = self.client.get('/api/route/1/', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.data['is_complete'], False)

    def test_route_is_complete(self):
        """
        Student one is in range of the Perkins stop, Student two is in range of the Pitch stop

        :return: None
        """
        distance = get_straightline_distance(*self.wilkinson_loc, *self.perkins_loc)
        self.assertLessEqual(distance, 0.3)
        student_response = self.client.get('/api/student/1/', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(student_response.data['has_inrange_stop'], True)

        distance = get_straightline_distance(*self.decker_loc, *self.pitch_loc)
        self.assertLessEqual(distance, 0.3)
        student_response = self.client.get('/api/student/2/', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(student_response.data['has_inrange_stop'], True)

        response = self.client.get('/api/route/1/', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.data['is_complete'], True)

    def test_routes_without_students_are_complete(self):
        """
        Route 1 should be complete after students are deleted
        :return: None
        """
        self.client.delete('/api/student/1/', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.client.delete('/api/student/2/', HTTP_AUTHORIZATION=f'Token {self.admin_token}')
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
        school = School.objects.create(address='Duke University', longitude=0, latitude=0, name='example school')
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
                               school=school, routes=route, guardian=self.parent1,
                               student_id=1)
        Student.objects.create(full_name='student 2', active=True,
                               school=school, routes=route, guardian=self.parent2,
                               student_id=2)


@tag('ext-api')
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
        stops = Stop.objects.filter(route=route).order_by('id')
        old_dropoff, old_pickup = [], []

        for stop in stops:
            # print(f"stop_name: {stop.name}, dropoff time:{stop.dropoff_time}, pickup time:{stop.pickup_time}")
            old_dropoff.append(stop.dropoff_time)
            old_pickup.append(stop.pickup_time)
            self.assertIsNot(stop.dropoff_time, "12:11:00")
            self.assertIsNot(stop.pickup_time, "11:11:00")

        school.bus_arrival_time = datetime.time(10, 0, 0)
        school.bus_departure_time = datetime.time(17, 0, 0)
        school.save()

        old_dropoff2, old_pickup2 = [], []
        for stop in Stop.objects.filter(route=route).order_by('id'):

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

    def test_single_stop_dropoff_and_pickup(self):
        school = School.objects.create(
            address='2211 Hillsborough Road Durham, NC 27705',
            longitude=36.009121,
            latitude=-78.926017,
            name='Test Single Stop',
            bus_arrival_time=datetime.time(9, 0, 0),
            bus_departure_time=datetime.time(16, 0, 0)
        )
        route = Route.objects.create(
            name='Test Single Stop Route',
            description='test route',
            school=school,
        )
        stop = Stop.objects.create(
            name='Test Single Stop',
            latitude=35.996996,
            longitude=-78.944668,
            stop_number=1,
            route=route,
        )
        # print(Stop.objects.filter(route=route).order_by('id')[0].pickup_time)
        self.assertNotEqual(Stop.objects.filter(route=route).order_by('id')[0].pickup_time, school.bus_arrival_time)

    def test_over_limit_stops(self):
        school = School.objects.create(
            address='2211 Hillsborough Road Durham, NC 27705',
            longitude=36.009121,
            latitude=-78.926017,
            name='Test 26 Stops',
            bus_arrival_time=datetime.time(9, 0, 0),
            bus_departure_time=datetime.time(16, 0, 0)
        )
        route = Route.objects.create(
            name='Test 26 Stops Route',
            description='test route',
            school=school,
        )
        stop1 = Stop.objects.create(
            name='Test 26 Stops Stop 1',
            latitude=35.896996,
            longitude=-78.944668,
            stop_number=1,
            route=route,
        )
        stop2 = Stop.objects.create(
            name='Test 26 Stops Stop 2',
            latitude=35.796996,
            longitude=-78.944668,
            stop_number=2,
            route=route,
        )
        stop3 = Stop.objects.create(
            name='Test 26 Stops Stop 3',
            latitude=35.926996,
            longitude=-78.944668,
            stop_number=3,
            route=route,
        )
        stop4 = Stop.objects.create(
            name='Test 26 Stops Stop 4',
            latitude=35.916996,
            longitude=-78.944668,
            stop_number=4,
            route=route,
        )
        stop5 = Stop.objects.create(
            name='Test 26 Stops Stop 5',
            latitude=35.396996,
            longitude=-78.944668,
            stop_number=5,
            route=route,
        )
        stop6 = Stop.objects.create(
            name='Test 26 Stops Stop 6',
            latitude=35.976996,
            longitude=-78.944668,
            stop_number=6,
            route=route,
        )
        stop7 = Stop.objects.create(
            name='Test 26 Stops Stop 7',
            latitude=35.994996,
            longitude=-78.944668,
            stop_number=7,
            route=route,
        )
        stop8 = Stop.objects.create(
            name='Test 26 Stops Stop 8',
            latitude=35.926996,
            longitude=-78.944668,
            stop_number=8,
            route=route,
        )
        stop9 = Stop.objects.create(
            name='Test 26 Stops Stop 9',
            latitude=35.996996,
            longitude=-78.944668,
            stop_number=1,
            route=route,
        )
        stop10 = Stop.objects.create(
            name='Test 26 Stops Stop 10',
            latitude=35.996996,
            longitude=-78.944668,
            stop_number=1,
            route=route,
        )
        stop11 = Stop.objects.create(
            name='Test 26 Stops Stop 11',
            latitude=35.996996,
            longitude=-78.944668,
            stop_number=1,
            route=route,
        )
        stop12 = Stop.objects.create(
            name='Test 26 Stops Stop 12',
            latitude=35.996996,
            longitude=-78.944668,
            stop_number=1,
            route=route,
        )


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
                              'phone_number': '0000000000',
                              'password': 'mysteryshack',
                              'address': 'Mostly an alternative dimension',
                              'latitude': 0.0,
                              'longitude': 0.0,
                              'groups': [],
                              'managed_schools': [],
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
        self.assertEqual(str(response.data['non_field_errors'][0]), 'Student school is not the same as student route')
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
                                        'phone_number': '0000000000',
                                        'latitude': 0,
                                        'longitude': 0,
                                        }),
                                   content_type='application/json',
                                   HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.status_code, 200)
        response = self.client.put(f'/api/user/{self.normal_user2.id}/',
                                   json.dumps(
                                       {'email': 'user2@gmail.com',
                                        'full_name': 'Should not be set',
                                        'address': 'address',
                                        'phone_number': '0000000000',
                                        'longitude': 0,
                                        'latitude': 0,
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
                                            'phone_number': 'abcdef',
                                            'password': 'wordpass',
                                            'address': None,
                                            'latitude': 0,
                                            'longitude': 0,
                                            'groups': [],
                                            'managed_schools': [],
                                        }),
                                    content_type='application/json',
                                    HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(response.data['user']['address'], None)
