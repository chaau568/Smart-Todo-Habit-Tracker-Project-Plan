from rest_framework import serializers

from tracking.models import HabitTracking, TaskTracking


class TaskTrackingSerializer(serializers.ModelSerializer):
    progress = serializers.FloatField(read_only=True)

    class Meta:
        model = TaskTracking
        fields = ["id", "task_id", "time_succeeded", "time_failed", "progress", "updated_at"]
        read_only_fields = fields


class HabitTrackingSerializer(serializers.ModelSerializer):
    progress = serializers.FloatField(read_only=True)

    class Meta:
        model = HabitTracking
        fields = [
            "id", "habit_id", "time_succeeded", "time_failed",
            "streak_count", "max_streak", "progress", "updated_at",
        ]
        read_only_fields = fields
