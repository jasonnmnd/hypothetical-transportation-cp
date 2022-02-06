from django.contrib import admin
from django.contrib.auth import get_user_model
from authemail.admin import EmailUserAdmin


class MyUserAdmin(EmailUserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'address')}),
        ('Permissions', {'fields': ('is_active', 'is_staff',
                                    'is_superuser', 'is_verified',
                                    'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Custom info', {'fields': ('date_of_birth',)}),
    )
    list_display = ('email', 'is_verified', 'full_name',
                    'is_staff')
    search_fields = ('full_name', 'email')


admin.site.unregister(get_user_model())
admin.site.register(get_user_model(), MyUserAdmin)
