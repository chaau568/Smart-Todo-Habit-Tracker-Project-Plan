from django.contrib import admin

from tracking.models import HabitTracking, TaskTracking


@admin.register(TaskTracking)
class TaskTrackingAdmin(admin.ModelAdmin):
    list_display = ["task", "time_succeeded", "time_failed", "updated_at"]
    search_fields = ["task__title", "task__user__username"]
    ordering = ["-updated_at"]


@admin.register(HabitTracking)
class HabitTrackingAdmin(admin.ModelAdmin):
    list_display = ["habit", "time_succeeded", "time_failed", "streak_count", "max_streak", "updated_at"]
    search_fields = ["habit__title", "habit__user__username"]
    ordering = ["-updated_at"]
