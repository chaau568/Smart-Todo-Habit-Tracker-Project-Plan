import logging
from datetime import timedelta

from django.utils import timezone

from habits.models import Habit, HabitLog
from notifications.models import Notification
from tasks.models import Task

logger = logging.getLogger(__name__)


class NotificationService:

    @staticmethod
    def _local_datetime(hour: int, minute: int = 0):
        today = timezone.localdate()
        naive = timezone.datetime(today.year, today.month, today.day, hour, minute)
        return timezone.make_aware(naive)

    @staticmethod
    def _save(user, ntype, scheduled_at, task=None, habit=None, **fields) -> bool:
        """Create notification only if one doesn't already exist for this user+type+task/habit+day."""
        exists = Notification.objects.filter(
            user=user,
            type=ntype,
            task=task,
            habit=habit,
            scheduled_at__date=scheduled_at.date(),
        ).exists()
        if not exists:
            Notification.objects.create(
                user=user,
                type=ntype,
                task=task,
                habit=habit,
                scheduled_at=scheduled_at,
                sent_at=timezone.now(),
                **fields,
            )
            return True
        return False

    @staticmethod
    def generate_morning_habits() -> int:
        """08:00 — remind all active habits scheduled for today."""
        today = timezone.localdate()
        scheduled_at = NotificationService._local_datetime(8, 0)
        count = 0

        habits = (
            Habit.objects.filter(
                start_date__lte=today,
                status=Habit.Status.ACTIVE,
            )
            .exclude(end_date__lt=today)
            .select_related("user")
        )

        for habit in habits:
            created = NotificationService._save(
                user=habit.user,
                habit=habit,
                ntype=Notification.Type.HABIT_REMINDER,
                scheduled_at=scheduled_at,
                title=f"อย่าลืม: {habit.title}",
                description="วันนี้มี habit รอ check-in อยู่ อย่าลืมทำนะ!",
            )
            if created:
                count += 1

        logger.info("[Notification] Morning habits created: %d", count)
        return count

    @staticmethod
    def generate_evening_habits() -> int:
        """20:00 — remind habits not yet checked in today."""
        today = timezone.localdate()
        scheduled_at = NotificationService._local_datetime(20, 0)
        count = 0

        checked_ids = set(
            HabitLog.objects.filter(completed_date=today).values_list("habit_id", flat=True)
        )

        habits = (
            Habit.objects.filter(
                start_date__lte=today,
                status=Habit.Status.ACTIVE,
            )
            .exclude(end_date__lt=today)
            .exclude(id__in=checked_ids)
            .select_related("user")
        )

        for habit in habits:
            created = NotificationService._save(
                user=habit.user,
                habit=habit,
                ntype=Notification.Type.HABIT_REMINDER,
                scheduled_at=scheduled_at,
                title=f"ยังไม่ได้ check-in: {habit.title}",
                description="เหลือเวลาอีกนิดนึง อย่าลืม check-in ก่อนสิ้นวันนะ!",
            )
            if created:
                count += 1

        logger.info("[Notification] Evening habits created: %d", count)
        return count

    @staticmethod
    def generate_task_reminders() -> int:
        """08:00 — task start day, 3 days before due, and due day reminders."""
        today = timezone.localdate()
        three_days_later = today + timedelta(days=3)
        scheduled_at = NotificationService._local_datetime(8, 0)
        active = [Task.Status.PENDING, Task.Status.IN_PROGRESS]
        count = 0

        for task in Task.objects.filter(
            start_date=today, status=Task.Status.PENDING
        ).select_related("user"):
            created = NotificationService._save(
                user=task.user,
                task=task,
                ntype=Notification.Type.TASK_REMINDER,
                scheduled_at=scheduled_at,
                title=f"Task เริ่มวันนี้: {task.title}",
                description="Task ของคุณเริ่มต้นแล้ว ลงมือทำได้เลย!",
            )
            if created:
                count += 1

        for task in Task.objects.filter(
            due_date=three_days_later, status__in=active
        ).select_related("user"):
            created = NotificationService._save(
                user=task.user,
                task=task,
                ntype=Notification.Type.TASK_REMINDER,
                scheduled_at=scheduled_at,
                title=f"เหลือ 3 วัน: {task.title}",
                description="Task ของคุณจะหมดเวลาในอีก 3 วัน รีบจัดการด้วยนะ!",
            )
            if created:
                count += 1

        for task in Task.objects.filter(
            due_date=today, status__in=active
        ).select_related("user"):
            created = NotificationService._save(
                user=task.user,
                task=task,
                ntype=Notification.Type.TASK_REMINDER,
                scheduled_at=scheduled_at,
                title=f"วันสุดท้าย: {task.title}",
                description="นี่คือวันสุดท้ายของ Task นี้ รีบทำให้เสร็จ!",
            )
            if created:
                count += 1

        logger.info("[Notification] Task reminders created: %d", count)
        return count
