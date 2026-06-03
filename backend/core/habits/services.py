from django.db import transaction
from django.utils import timezone

from habits.models import Habit, HabitLog
from tracking.models import HabitTracking


class HabitService:
    @staticmethod
    @transaction.atomic
    def create_habit(user, validated_data: dict) -> Habit:
        habit = Habit.objects.create(user=user, **validated_data)
        HabitTracking.objects.create(habit=habit)
        return habit

    @staticmethod
    @transaction.atomic
    def check_in(habit: Habit) -> Habit:
        from achievements.services.achievement_service import AchievementService
        habit.check_in()
        habit.tracking.increment_success()
        HabitLog.objects.create(
            habit=habit,
            user=habit.user,
            completed_date=timezone.localdate(),
        )
        AchievementService.check_and_unlock(habit.user)
        return habit

    @staticmethod
    @transaction.atomic
    def skip(habit: Habit) -> Habit:
        habit.skip()
        habit.tracking.increment_failure()
        return habit

    @staticmethod
    @transaction.atomic
    def soft_delete_habit(habit: Habit) -> Habit:
        habit.soft_delete()
        return habit
