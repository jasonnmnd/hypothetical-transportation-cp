from accounts.models import InvitationCode
from django.contrib.auth import get_user_model


def send_invite_email(request, student):
    # Sends an invite so that the user can log in via the invitation email later.
    user = get_user_model().objects.get(email=student.email)
    user.full_name = student.full_name
    user.address = student.guardian.address
    user.latitude = student.guardian.latitude
    user.longitude = student.guardian.longitude
    user.save()
    ipaddr = request.META.get('REMOTE_ADDR', '0.0.0.0')
    invite_code = InvitationCode.objects.create_signup_code(user=user, ipaddr=ipaddr)
    invite_code.send_invitation_email()
