from rest_framework import serializers

from achievements.models import Achievement, UserAchievement


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ["id", "title", "description", "rank", "type", "condition", "is_active", "created_at"]
        read_only_fields = ["id", "created_at"]


class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)

    class Meta:
        model = UserAchievement
        fields = ["id", "achievement", "unlocked_at"]
        read_only_fields = fields
