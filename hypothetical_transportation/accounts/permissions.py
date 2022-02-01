from rest_framework import permissions


def is_admin(user):
    return user.groups.filter(name='Administrator').exists()


class IsAdmin(permissions.BasePermission):
    """
    Admins need to be registered and have CRUD access to everything
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated or not is_admin(request.user):
            return False
        return True

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated or not is_admin(request.user):
            return False
        return True
