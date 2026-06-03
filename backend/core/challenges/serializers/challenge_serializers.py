from django.contrib.auth import get_user_model
from rest_framework import serializers

from challenges.models import Challenge, ChallengeParticipant

User = get_user_model()


class ChallengeSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source="owner.username", read_only=True)

    class Meta:
        model = Challenge
        fields = [
            "id", "title", "description", "challenge_type", "rules",
            "start_date", "due_date", "time_periods",
            "is_active", "owner_username", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "is_active", "owner_username", "created_at", "updated_at"]


class ParticipantUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class ChallengeParticipantSerializer(serializers.ModelSerializer):
    user = ParticipantUserSerializer(read_only=True)

    class Meta:
        model = ChallengeParticipant
        fields = ["id", "user", "score", "joined_at"]
        read_only_fields = fields
