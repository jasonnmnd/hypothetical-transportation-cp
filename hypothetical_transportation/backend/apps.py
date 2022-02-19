from django import dispatch
from django.apps import AppConfig


class BackendConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend'

    def ready(self):
        from .signals.stop_planner import school_update, stop_update
        from .models import School, Stop
        from django.db.models.signals import post_save, post_delete
        post_save.connect(school_update, School, False, dispatch_uid='school_create_modify_handler')
        post_save.connect(stop_update, Stop, False, dispatch_uid='stop_create_modify_handler')
        post_delete.connect(stop_update, Stop, False, dispatch_uid='stop_delete_handler')
        
