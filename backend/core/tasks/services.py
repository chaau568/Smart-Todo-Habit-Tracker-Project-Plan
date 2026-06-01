from django.utils import timezone

from tasks.models import Task


class TaskService:
    @staticmethod
    def create_task(user, validated_data: dict) -> Task:
        return Task.objects.create(user=user, **validated_data)

    @staticmethod
    def sync_in_progress(user=None) -> int:
        """
        Auto-transition pending tasks to in_progress when start_date <= today.
        Should be called by a scheduled Celery task daily.
        """
        today = timezone.localdate()
        qs = Task.objects.filter(status=Task.Status.PENDING, start_date__lte=today)
        if user:
            qs = qs.filter(user=user)
        return qs.update(status=Task.Status.IN_PROGRESS)

    @staticmethod
    def complete_task(task: Task) -> Task:
        task.status = Task.Status.COMPLETED
        task.completed_at = timezone.now()
        task.save(update_fields=['status', 'completed_at', 'updated_at'])
        return task

    @staticmethod
    def cancel_task(task: Task) -> Task:
        task.status = Task.Status.CANCELLED
        task.save(update_fields=['status', 'updated_at'])
        return task

    @staticmethod
    def soft_delete_task(task: Task) -> Task:
        task.deleted_at = timezone.now()
        task.save(update_fields=['deleted_at', 'updated_at'])
        return task
