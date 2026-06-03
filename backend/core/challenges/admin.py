from django.contrib import admin

from challenges.models import Challenge, ChallengeParticipant


@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ["title", "owner", "challenge_type", "is_active", "start_date", "due_date", "created_at"]
    list_filter = ["challenge_type", "is_active"]
    search_fields = ["title", "owner__username"]
    ordering = ["-created_at"]


@admin.register(ChallengeParticipant)
class ChallengeParticipantAdmin(admin.ModelAdmin):
    list_display = ["challenge", "user", "score", "joined_at"]
    list_filter = ["challenge"]
    search_fields = ["challenge__title", "user__username"]
    ordering = ["-score"]
