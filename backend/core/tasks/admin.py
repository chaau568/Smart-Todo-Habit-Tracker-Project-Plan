from django.contrib import admin

from tasks.models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'status', 'priority', 'start_date', 'due_date']
    list_filter = ['status', 'priority']
    search_fields = ['title', 'user__username']
