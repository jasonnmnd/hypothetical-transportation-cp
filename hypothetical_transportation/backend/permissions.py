from rest_framework import permissions


# Source: https://stackoverflow.com/questions/19313314/django-rest-framework-viewset-per-action-permissions
class IsAdminOrReadOnlyParent(permissions.BasePermission):

    @staticmethod
    def is_admin(user):
        # TODO: introduce access classes?
        return user.is_staff

    def has_permission(self, request, view):
        print(request.user.groups)
        if not request.user.is_authenticated:
            return False
        if self.is_admin(request.user):
            return True
        return True

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        if self.is_admin(request.user):
            return True
        return True
