from django.contrib import admin

from habits.models import Habit, HabitLog


@admin.register(Habit)
class HabitAdmin(admin.ModelAdmin):
    list_display = ["title", "user", "status", "start_date", "end_date", "time_periods"]
    list_filter = ["status"]
    search_fields = ["title", "user__username"]
    ordering = ["-created_at"]


@admin.register(HabitLog)
class HabitLogAdmin(admin.ModelAdmin):
    list_display = ["habit", "user", "completed_date", "created_at"]
    list_filter = ["completed_date"]
    search_fields = ["habit__title", "user__username"]
    ordering = ["-completed_date"]
