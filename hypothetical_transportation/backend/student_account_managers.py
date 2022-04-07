from accounts.models import InvitationCode
from .models import Student
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group


def send_invite_email(student: Student):
    """
    Send an invite email so a student may login to the system
    :param request: Request containing IP address information
    :param student:
    :return: None
    """
    user = get_user_model().objects.create_user(email=student.email, latitude=None,
                                                longitude=None)
    user.address = None
    user.full_name = student.full_name
    user.phone_number = student.phone_number
    if Group.objects.filter(name="Student").count() > 0:
        user.groups.add(Group.objects.get(name="Student"))
    user.linked_student = student
    user.save()
    invite_code = InvitationCode.objects.create_signup_code(user=user, ipaddr='0.0.0.0')
    invite_code.send_invitation_email()


def sync_parent_changes_to_student_account(parent):
    """
    Ensure that changes to parents will propagate to the accounts of children

    :param parent: Auth User object
    :return: None
    """
    for student in parent.students.all():
        if student.email is not None:
            student_account = get_user_model().objects.get(email=student.email)
            # student_account.address = parent.address
            # student_account.latitude = parent.latitude
            # student_account.longitude = parent.longitude
            student_account.save()


def sync_student_account_changes_to_student(student_account):
    """
    Ensure that changes to parents will propagate to the original student information

    :param student_account: Auth User object
    :return: None
    """
    student = student_account.linked_student
    student.email = student_account.email
    student.full_name = student_account.full_name
    student.save()


def sync_student_account(student: Student, prev_email):
    """
    Synchronizes information between a student and their associated account.

    Does nothing if the student does not have a user login account.
    :param student: student object
    :return: None
    """
    if prev_email is None and student.email is not None:
        # If student is provided an email, initiate the account process
        send_invite_email(student)
    elif prev_email is not None and student.email is None:
        # If an email is taken from a student, remove the account from logging in
        get_user_model().objects.get(email=prev_email).delete()
    elif student.email is not None and get_user_model().objects.filter(email=prev_email).count() > 0:
        # If student paired account exists, update with the correct information
        user = get_user_model().objects.get(email=prev_email)
        user.full_name = student.full_name
        user.email = student.email
        user.save()
