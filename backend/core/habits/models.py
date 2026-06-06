from django.conf import settings
from django.db import models
from django.utils import timezone


class Habit(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        SUCCEEDED = "SUCCEEDED", "Succeeded"
        FAILED = "FAILED", "Failed"
        SKIPPED = "SKIPPED", "Skipped"
        DELETED = "DELETED", "Deleted"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="habits",
    )
    category = models.ForeignKey(
        "categories.Category",
        on_delete=models.SET_NULL,
        related_name="habits",
        null=True,
        blank=True,
    )
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    time_periods = models.PositiveIntegerField(default=1)
    note = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "habits"
        indexes = [
            models.Index(fields=["user", "status"]),
        ]

    def __str__(self):
        return self.title

    def check_in(self):
        self.status = self.Status.SUCCEEDED
        self.save()

    def skip(self):
        self.status = self.Status.SKIPPED
        self.save()

    def soft_delete(self):
        self.status = self.Status.DELETED
        self.save()


class HabitLog(models.Model):
    habit = models.ForeignKey(
        Habit,
        on_delete=models.CASCADE,
        related_name="logs",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="habit_logs",
    )
    completed_date = models.DateField(default=timezone.localdate)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "habit_logs"
        indexes = [
            models.Index(fields=["habit", "-completed_date"]),
        ]
