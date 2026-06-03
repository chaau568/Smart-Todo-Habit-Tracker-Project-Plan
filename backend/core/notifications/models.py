from django.conf import settings
from django.db import models


class Notification(models.Model):
    class Type(models.TextChoices):
        TASK_REMINDER = "task_reminder", "Task Reminder"
        HABIT_REMINDER = "habit_reminder", "Habit Reminder"
        ACHIEVEMENT_UNLOCKED = "achievement_unlocked", "Achievement Unlocked"
        CHALLENGE_UPDATE = "challenge_update", "Challenge Update"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    task = models.ForeignKey(
        "tasks.Task",
        on_delete=models.CASCADE,
        related_name="notifications",
        null=True,
        blank=True,
    )
    habit = models.ForeignKey(
        "habits.Habit",
        on_delete=models.CASCADE,
        related_name="notifications",
        null=True,
        blank=True,
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    type = models.CharField(max_length=30, choices=Type.choices)
    is_read = models.BooleanField(default=False)
    scheduled_at = models.DateTimeField()
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "notifications"
        indexes = [
            models.Index(fields=["user", "is_read"]),
            models.Index(fields=["scheduled_at"]),
        ]

    def __str__(self):
        return self.title

    def mark_as_read(self):
        self.is_read = True
        self.save()
