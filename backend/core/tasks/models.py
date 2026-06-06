from django.conf import settings
from django.db import models
from django.utils import timezone


class Task(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        SUCCEEDED = "SUCCEEDED", "Succeeded"
        FAILED = "FAILED", "Failed"
        CANCELED = "CANCELED", "Canceled"
        DELETED = "DELETED", "Deleted"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tasks",
    )
    category = models.ForeignKey(
        "categories.Category",
        on_delete=models.SET_NULL,
        related_name="tasks",
        null=True,
        blank=True,
    )
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    start_date = models.DateField()
    due_date = models.DateField()
    completed_at = models.DateTimeField(null=True, blank=True)
    note = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tasks"
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["user", "due_date"]),
        ]

    def __str__(self):
        return self.title

    def mark_in_progress(self):
        self.status = self.Status.IN_PROGRESS
        self.save()

    def complete(self):
        self.status = self.Status.SUCCEEDED
        self.completed_at = timezone.now()
        self.save()

    def cancel(self):
        self.status = self.Status.CANCELED
        self.save()

    def soft_delete(self):
        self.status = self.Status.DELETED
        self.save()


class TaskLog(models.Model):
    class Action(models.TextChoices):
        CREATED = "created", "Created"
        COMPLETED = "completed", "Completed"
        CANCELED = "canceled", "Canceled"
        DELETED = "deleted", "Deleted"

    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name="logs",
    )
    action = models.CharField(max_length=20, choices=Action.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "task_logs"
        indexes = [
            models.Index(fields=["task", "-created_at"]),
        ]
