from rest_framework import permissions


def is_admin(user):
    return user.groups.filter(name='Administrator').exists()


def is_write_action(action):
    if action in ['retrieve', 'update', 'partial_update', 'destroy', 'create']:
        return True
    return False


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


# Source: https://stackoverflow.com/questions/19313314/django-rest-framework-viewset-per-action-permissions
class IsAdminOrReadOnlyParent(permissions.BasePermission):

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if is_admin(request.user):
            return True
        if is_write_action(view.action):
            return False
        return True

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        if is_admin(request.user):
            return True
        if is_write_action(view.action):
            return False
        return True
