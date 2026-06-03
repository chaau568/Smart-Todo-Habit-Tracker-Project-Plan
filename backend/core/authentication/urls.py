from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from authentication import views

urlpatterns = [
    path("register/", views.register, name="auth-register"),
    path("login/", views.login, name="auth-login"),
    path("profile/", views.profile, name="auth-profile"),
    path("change-password/", views.change_password, name="auth-change-password"),
    path("delete/", views.delete_account, name="auth-delete"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
]
