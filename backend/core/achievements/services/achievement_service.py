from django.db.models import Max, Sum

from achievements.models import Achievement, UserAchievement
from tracking.models import HabitTracking, TaskTracking

_METRIC_RESOLVERS = {
    "habit_max_streak": lambda user: (
        HabitTracking.objects.filter(habit__user=user).aggregate(v=Max("max_streak"))["v"] or 0
    ),
    "habit_succeeded_count": lambda user: (
        HabitTracking.objects.filter(habit__user=user).aggregate(v=Sum("time_succeeded"))["v"] or 0
    ),
    "task_succeeded_count": lambda user: (
        TaskTracking.objects.filter(task__user=user).aggregate(v=Sum("time_succeeded"))["v"] or 0
    ),
}

_OPERATORS = {
    ">=": lambda actual, threshold: actual >= threshold,
    ">":  lambda actual, threshold: actual > threshold,
    "==": lambda actual, threshold: actual == threshold,
}


class AchievementService:
    @staticmethod
    def _evaluate(user, condition: dict) -> bool:
        resolver = _METRIC_RESOLVERS.get(condition.get("metric"))
        compare = _OPERATORS.get(condition.get("operator"))
        if not resolver or not compare:
            return False
        return compare(resolver(user), condition.get("value", 0))

    @staticmethod
    def check_and_unlock(user) -> list:
        already_unlocked = UserAchievement.objects.filter(user=user).values_list("achievement_id", flat=True)
        candidates = Achievement.objects.filter(is_active=True).exclude(id__in=already_unlocked)

        newly_unlocked = []
        for achievement in candidates:
            if AchievementService._evaluate(user, achievement.condition):
                UserAchievement.objects.create(user=user, achievement=achievement)
                newly_unlocked.append(achievement)

        return newly_unlocked
