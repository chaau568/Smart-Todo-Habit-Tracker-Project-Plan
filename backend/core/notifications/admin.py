from django.contrib import admin

from notifications.models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ["title", "user", "type", "is_read", "scheduled_at", "sent_at", "created_at"]
    list_filter = ["type", "is_read"]
    search_fields = ["title", "user__username"]
    ordering = ["-created_at"]
