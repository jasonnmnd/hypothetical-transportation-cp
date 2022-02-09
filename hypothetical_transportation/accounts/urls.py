from django.urls import path, include
from .api import RegisterAPI, LoginAPI, UserAPI, ChangePasswordAPI, InviteAPI, InviteVerifyAPI
from knox import views as knox_views
from authemail import views

urlpatterns = [
    path('api/auth', include('knox.urls')),
    path('api/auth/invite', InviteAPI.as_view()),
    path('api/auth/invite/verify', InviteVerifyAPI.as_view()),

    path('api/auth/password/reset', views.PasswordReset.as_view(),
         name='authemail-password-reset'),
    path('api/auth/password/reset/verify', views.PasswordResetVerify.as_view(),
         name='authemail-password-reset-verify'),
    path('api/auth/password/reset/verified', views.PasswordResetVerified.as_view(),
         name='authemail-password-reset-verified'),

    path('api/auth/register', RegisterAPI.as_view()),
    path('api/auth/login', LoginAPI.as_view()),
    path('api/auth/user', UserAPI.as_view()),
    path('api/auth/change-password', ChangePasswordAPI.as_view()),
    path('api/auth/logout', knox_views.LogoutView.as_view(), name='knox_logout')
]
