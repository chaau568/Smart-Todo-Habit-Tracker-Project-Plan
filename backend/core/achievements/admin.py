from django.contrib import admin

from achievements.models import Achievement, UserAchievement


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ["title", "rank", "type", "is_active", "created_by", "created_at"]
    list_filter = ["rank", "type", "is_active"]
    search_fields = ["title", "description"]
    ordering = ["rank", "title"]


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ["user", "achievement", "unlocked_at"]
    list_filter = ["achievement__rank", "achievement__type"]
    search_fields = ["user__username", "achievement__title"]
    ordering = ["-unlocked_at"]
