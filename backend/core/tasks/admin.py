from django.contrib import admin

from tasks.models import Task, TaskLog


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ["title", "user", "status", "start_date", "due_date"]
    list_filter = ["status"]
    search_fields = ["title", "user__username"]
    ordering = ["-created_at"]


@admin.register(TaskLog)
class TaskLogAdmin(admin.ModelAdmin):
    list_display = ["task", "action", "created_at"]
    list_filter = ["action"]
    search_fields = ["task__title", "task__user__username"]
    ordering = ["-created_at"]
