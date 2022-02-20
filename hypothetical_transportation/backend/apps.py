from django.apps import AppConfig


class BackendConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend'

    def ready(self):
        # from .signals.stop_planner import complete_consistency
        # from .models import School, Student, Route, Stop
        # from django.contrib.auth import get_user_model
        # from django.db.models.signals import post_save, post_delete
        # post_save.connect(complete_consistency, School, False, dispatch_uid='school_create_modify_handler')
        # post_delete.connect(complete_consistency, School, False, dispatch_uid='school_delete_handler')
        # post_save.connect(complete_consistency, Stop, False, dispatch_uid='stop_create_modify_handler')
        # post_delete.connect(complete_consistency, Stop, False, dispatch_uid='stop_delete_handler')
        # post_save.connect(complete_consistency, Student, False, dispatch_uid='student_create_modify_handler')
        # post_delete.connect(complete_consistency, Student, False, dispatch_uid='student_delete_handler')
        # post_save.connect(complete_consistency, Route, False, dispatch_uid='route_create_modify_handler')
        # post_delete.connect(complete_consistency, Route, False, dispatch_uid='route_delete_handler')
        # post_save.connect(complete_consistency, get_user_model(), False, dispatch_uid='user_create_modify_handler')
        # post_delete.connect(complete_consistency, get_user_model(), False, dispatch_uid='user_delete_handler')
        pass
