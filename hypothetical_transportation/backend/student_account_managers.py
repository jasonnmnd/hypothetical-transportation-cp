from accounts.models import InvitationCode
from .models import Student
from django.contrib.auth import get_user_model


def send_invite_email(student: Student):
    """
    Send an invite email so a student may login to the system
    :param request: Request containing IP address information
    :param student:
    :return: None
    """
    print("SENDING EMAIL")
    user = get_user_model().objects.create_user(email=student.email, latitude=student.guardian.latitude,
                                                longitude=student.guardian.longitude)
    user.full_name = student.full_name
    user.address = student.guardian.address
    user.latitude = student.guardian.latitude
    user.longitude = student.guardian.longitude
    user.save()
    # ipaddr = request.META.get('REMOTE_ADDR', '0.0.0.0')
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
            student_account.address = parent.address
            student_account.latitude = parent.latitude
            student_account.longitude = parent.longitude


def sync_student_account_changes_to_student(student_account):
    """
    Ensure that changes to parents will propagate to the original student information

    :param student_account: Auth User object
    :return: None
    """
    student = student_account.linked_student
    student.email = student_account.email
    student.full_name = student_account.full_name


def sync_student_account(student: Student, prev_email):
    """
    Synchronizes information between a student and their associated account.

    Does nothing if the student does not have a user login account.
    :param student: student object
    :return: None
    """
    if prev_email is None and student.email is not None:
        # If student is provided an email, initiate the account process
        print('case 1')
        send_invite_email(student)
    elif prev_email is not None and student.email is None:
        # If an email is taken from a student, remove the account from logging in
        print('case 2')
        get_user_model().objects.get(email=student.email).delete()
    elif student.email is not None and get_user_model().objects.filter(email=student.email).count() > 0:
        # If student paired account exists, update with the correct information
        print('case 3')
        user = get_user_model().objects.get(email=student.email)
        user.full_name = student.full_name
        user.email = student.email
