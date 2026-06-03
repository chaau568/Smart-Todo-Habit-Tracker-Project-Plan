from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import AuthenticationForm
from django import forms

from authentication.models import User


class EmailAuthenticationForm(AuthenticationForm):
    username = forms.EmailField(
        label="Email",
        widget=forms.EmailInput(attrs={"autofocus": True}),
    )


admin.site.login_form = EmailAuthenticationForm


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ("email", "username", "role", "status", "is_active", "is_staff")
    list_filter = ("role", "status", "is_active")
    search_fields = ("email", "username")
    ordering = ("-created_at",)
    readonly_fields = ("last_login",)
    fieldsets = (
        (None, {"fields": ("email", "username", "password")}),
        ("Info", {"fields": ("role", "status")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Activity", {"fields": ("last_login",)}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "password1", "password2", "role"),
        }),
    )
