from rest_framework import permissions


# Source: https://stackoverflow.com/questions/19313314/django-rest-framework-viewset-per-action-permissions
class IsAdminOrReadOnlyParent(permissions.BasePermission):

    @staticmethod
    def is_admin(user):
        return user.groups.filter(name='Administrators').exists()

    @staticmethod
    def is_write_action(action):
        if action in ['retrieve', 'update', 'partial_update', 'destroy', 'create']:
            return True
        return False

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if self.is_admin(request.user):
            return True
        if self.is_write_action(view.action):
            return False
        return True

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        if self.is_admin(request.user):
            return True
        if self.is_write_action(view.action):
            return False
        return True
