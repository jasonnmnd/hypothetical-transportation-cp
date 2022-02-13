from django.apps import AppConfig


class BackendConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend'

    def ready(self):
        from .signals.stop_planner import school_update
        from .models import School
        from django.db.models.signals import post_save
        post_save.connect(school_update, School, False, dispatch_uid='school_create_modify_handler')
