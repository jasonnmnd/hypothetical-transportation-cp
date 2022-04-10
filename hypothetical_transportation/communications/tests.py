from django.test import TestCase
from django.test import Client
from django.core import mail
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.test import TransactionTestCase
import json
from backend.models import School
from backend.models import Route
from backend.models import Stop

from backend.models import Student


# Create your tests here.

class AnnouncementTests(TransactionTestCase):
    reset_sequences = True

    def setUp(self):
        """
        Test case has four parents, two schools, three routes, four stops, and three students
            School 1:
                Route 1: (parent1, student1),
                Route 2: (parent2, student2)
            School 2:
                Route 3: (parent3, student3), (parent4, student4)
        :return:
        """
        admin_group = Group.objects.create(name='Administrator')
        parent_group = Group.objects.create(name='Guardian')
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
        self.parent1 = get_user_model().objects.create_verified_user(email='hypotheticaltransportations+1@gmail.com',
                                                                     password='password',
                                                                     full_name='user', address='example address',
                                                                     latitude=3.0, longitude=-0.8)
        self.parent1.groups.add(parent_group)
        self.parent2 = get_user_model().objects.create_verified_user(email='hypotheticaltransportations+2@gmail.com',
                                                                     password='password',
                                                                     full_name='user', address='example address',
                                                                     latitude=4.0, longitude=-2.0)
        self.parent2.groups.add(parent_group)
        self.parent3 = get_user_model().objects.create_verified_user(email='hypotheticaltransportations+3@gmail.com',
                                                                     password='password',
                                                                     full_name='user', address='example address',
                                                                     latitude=4.0, longitude=-2.0)
        self.parent3.groups.add(parent_group)
        self.parent4 = get_user_model().objects.create_verified_user(email='hypotheticaltransportations+4@gmail.com',
                                                                     password='password',
                                                                     full_name='user', address='example address',
                                                                     latitude=4.0, longitude=-2.0)
        self.parent4.groups.add(parent_group)
        school1 = School.objects.create(address='origin', longitude=0, latitude=0, name='example school 1')
        school2 = School.objects.create(address='origin', longitude=0, latitude=0, name='example school 2')
        route1 = Route.objects.create(name='route 1', description='', school=school1)
        route2 = Route.objects.create(name='route 2', description='', school=school1)
        route3 = Route.objects.create(name='route 3', description='', school=school2)
        Student.objects.create(full_name='student 1', active=True,
                               school=school1, routes=route1, guardian=self.parent1,
                               student_id=1)
        Student.objects.create(full_name='student 2', active=True,
                               school=school1, routes=route2, guardian=self.parent2,
                               student_id=2)
        Student.objects.create(full_name='student 3', active=True,
                               school=school2, routes=route3, guardian=self.parent3,
                               student_id=1)
        Student.objects.create(full_name='student 4', active=True,
                               school=school2, routes=route3, guardian=self.parent4,
                               student_id=2)

    def test_general_announcement_all(self):
        """
        Test that all four parents are contacted by the all email.  Outbox size is 1 due to BCC
        :return: None
        """
        login_response = self.client.post('/api/communication/send-announcement',
                                          json.dumps(
                                              {
                                                  "id_type": "ALL",
                                                  "subject": "General Announcement",
                                                  "body": "Body Example"
                                              }
                                          ),
                                          content_type='application/json',
                                          HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        recipients = login_response.data['recipients']
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn(self.parent1.email, recipients)
        self.assertIn(self.parent2.email, recipients)
        self.assertIn(self.parent3.email, recipients)
        self.assertIn(self.parent4.email, recipients)

    def test_general_announcement_route(self):
        """
        Test that Route 1 and Route 3 both have correct number of recipients (1 parent and 2 parents, respectively)
        :return: None
        """
        login_response = self.client.post('/api/communication/send-announcement',
                                          json.dumps(
                                              {
                                                  "object_id": 1,
                                                  "id_type": "ROUTE",
                                                  "subject": "General Announcement (Route)",
                                                  "body": "Body Example"
                                              }
                                          ),
                                          content_type='application/json',
                                          HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        recipients = login_response.data['recipients']
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(len(recipients), 1)
        self.assertIn(self.parent1.email, recipients)
        mail.outbox = []
        login_response = self.client.post('/api/communication/send-announcement',
                                          json.dumps(
                                              {
                                                  "object_id": 3,
                                                  "id_type": "ROUTE",
                                                  "subject": "General Announcement (Route)",
                                                  "body": "Body Example"
                                              }
                                          ),
                                          content_type='application/json',
                                          HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        recipients = login_response.data['recipients']
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(len(recipients), 2)
        self.assertIn(self.parent3.email, recipients)
        self.assertIn(self.parent4.email, recipients)

    def test_general_announcement_school(self):
        """
        Test that announcement reaches parents of students who attend school 1 (parents 1 and 2)
        :return: None
        """
        login_response = self.client.post('/api/communication/send-announcement',
                                          json.dumps(
                                              {
                                                  "object_id": 1,
                                                  "id_type": "SCHOOL",
                                                  "subject": "General Announcement (School)",
                                                  "body": "Body Example"
                                              }
                                          ),
                                          content_type='application/json',
                                          HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        recipients = login_response.data['recipients']
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(len(recipients), 2)
        self.assertIn(self.parent1.email, recipients)
        self.assertIn(self.parent2.email, recipients)

    def test_route_announcement_all(self):
        """
        Test that all four parents are contacted by the all email.  Outbox size is 4 due to personalized content
        :return: None
        """
        login_response = self.client.post('/api/communication/send-route-announcement',
                                          json.dumps(
                                              {
                                                  "id_type": "ALL",
                                                  "subject": "Route Announcement (ALL)",
                                                  "body": "Body Example"
                                              }
                                          ),
                                          content_type='application/json',
                                          HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        recipients = login_response.data['recipients']
        self.assertEqual(len(mail.outbox), 4)
        self.assertIn(self.parent1.email, recipients)
        self.assertIn(self.parent2.email, recipients)
        self.assertIn(self.parent3.email, recipients)
        self.assertIn(self.parent4.email, recipients)

    def test_route_announcement_in_route(self):
        """
        Test that Route 1 and Route 3 both have correct number of announcement recipients (1 parent and 2 parents,
        respectively).
        :return: None
        """
        login_response = self.client.post('/api/communication/send-route-announcement',
                                          json.dumps(
                                              {
                                                  "object_id": 1,
                                                  "id_type": "ROUTE",
                                                  "subject": "Route Announcement (Route)",
                                                  "body": "Body Example"
                                              }
                                          ),
                                          content_type='application/json',
                                          HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        recipients = login_response.data['recipients']
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(len(recipients), 1)
        self.assertIn(self.parent1.email, recipients)
        mail.outbox = []
        login_response = self.client.post('/api/communication/send-route-announcement',
                                          json.dumps(
                                              {
                                                  "object_id": 3,
                                                  "id_type": "ROUTE",
                                                  "subject": "General Announcement (Route)",
                                                  "body": "Body Example"
                                              }
                                          ),
                                          content_type='application/json',
                                          HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        recipients = login_response.data['recipients']
        self.assertEqual(len(mail.outbox), 2)
        self.assertEqual(len(recipients), 2)
        self.assertIn(self.parent3.email, recipients)
        self.assertIn(self.parent4.email, recipients)

    def test_route_announcement_in_school(self):
        """
        Test that announcement reaches parents of students who attend school 1
        :return: None
        """
        login_response = self.client.post('/api/communication/send-route-announcement',
                                          json.dumps(
                                              {
                                                  "object_id": 1,
                                                  "id_type": "SCHOOL",
                                                  "subject": "General Announcement (School)",
                                                  "body": "Body Example"
                                              }
                                          ),
                                          content_type='application/json',
                                          HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        recipients = login_response.data['recipients']
        self.assertEqual(len(mail.outbox), 2)
        self.assertEqual(len(recipients), 2)
        self.assertIn(self.parent1.email, recipients)
        self.assertIn(self.parent2.email, recipients)

    def test_custom_template_and_payload_accepted(self):
        """
        Sends a route announcement, in Route 1 to parent 1 containing a custom payload to the template
        django_test_email.html.
        :return: None
        """
        code = hash("Message")
        self.client.post('/api/communication/send-announcement',
                         json.dumps(
                             {
                                 "object_id": 1,
                                 "id_type": "ROUTE",
                                 "subject": "General Announcement (Route)",
                                 "body": "Body Example",
                                 "template": "django_test_email.html",
                                 "context": {"code": code}
                             }
                         ),
                         content_type='application/json',
                         HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn(str(code), mail.outbox[0].body)
        mail.outbox = list()
        self.client.post('/api/communication/send-route-announcement',
                         json.dumps(
                             {
                                 "object_id": 1,
                                 "id_type": "ROUTE",
                                 "subject": "General Announcement (Route)",
                                 "body": "Body Example",
                                 "template": "django_test_email.html",
                                 "context": {"code": code}
                             }
                         ),
                         content_type='application/json',
                         HTTP_AUTHORIZATION=f'Token {self.admin_token}')
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn(str(code), mail.outbox[0].body)
