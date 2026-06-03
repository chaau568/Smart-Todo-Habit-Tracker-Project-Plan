from django.db import transaction
from django.utils import timezone

from tasks.models import Task, TaskLog
from tracking.models import TaskTracking


class TaskService:
    @staticmethod
    @transaction.atomic
    def create_task(user, validated_data: dict) -> Task:
        task = Task.objects.create(user=user, **validated_data)
        TaskTracking.objects.create(task=task)
        TaskLog.objects.create(task=task, action=TaskLog.Action.CREATED)
        return task

    @staticmethod
    def sync_in_progress(user=None) -> int:
        today = timezone.localdate()
        qs = Task.objects.filter(status=Task.Status.PENDING, start_date__lte=today)
        if user:
            qs = qs.filter(user=user)
        return qs.update(status=Task.Status.IN_PROGRESS)

    @staticmethod
    @transaction.atomic
    def complete_task(task: Task) -> Task:
        from achievements.services.achievement_service import AchievementService
        task.complete()
        task.tracking.increment_success()
        TaskLog.objects.create(task=task, action=TaskLog.Action.COMPLETED)
        AchievementService.check_and_unlock(task.user)
        return task

    @staticmethod
    @transaction.atomic
    def cancel_task(task: Task) -> Task:
        task.cancel()
        TaskLog.objects.create(task=task, action=TaskLog.Action.CANCELED)
        return task

    @staticmethod
    @transaction.atomic
    def soft_delete_task(task: Task) -> Task:
        task.soft_delete()
        TaskLog.objects.create(task=task, action=TaskLog.Action.DELETED)
        return task
