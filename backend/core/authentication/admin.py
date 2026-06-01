from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from authentication.models import SystemUser


@admin.register(SystemUser)
class SystemUserAdmin(UserAdmin):
    pass
