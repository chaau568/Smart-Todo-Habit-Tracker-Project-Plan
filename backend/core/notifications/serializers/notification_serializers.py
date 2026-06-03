from rest_framework import serializers

from notifications.models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            "id", "title", "description", "type",
            "is_read", "task_id", "habit_id",
            "scheduled_at", "sent_at", "created_at",
        ]
        read_only_fields = fields
