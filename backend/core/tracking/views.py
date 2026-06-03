from django.db.models import Max, Sum
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from habits.models import Habit
from tasks.models import Task
from tracking.models import HabitTracking, TaskTracking
from tracking.serializers import HabitTrackingSerializer, TaskTrackingSerializer


def _compute_summary(user):
    tasks = Task.objects.filter(user=user).exclude(status=Task.Status.DELETED)
    task_total = tasks.count()
    task_succeeded = tasks.filter(status=Task.Status.SUCCEEDED).count()
    task_failed = tasks.filter(status=Task.Status.FAILED).count()
    task_in_progress = tasks.filter(status=Task.Status.IN_PROGRESS).count()
    task_pending = tasks.filter(status=Task.Status.PENDING).count()
    task_completion_rate = round(task_succeeded / task_total * 100, 2) if task_total > 0 else 0.0

    habits = Habit.objects.filter(user=user).exclude(status=Habit.Status.DELETED)
    habit_total = habits.count()
    habit_agg = HabitTracking.objects.filter(habit__user=user).aggregate(
        max_streak=Max("max_streak"),
        current_streak=Max("streak_count"),
        total_succeeded=Sum("time_succeeded"),
        total_failed=Sum("time_failed"),
    )
    total_habit_actions = (habit_agg["total_succeeded"] or 0) + (habit_agg["total_failed"] or 0)
    habit_completion_rate = (
        round((habit_agg["total_succeeded"] or 0) / total_habit_actions * 100, 2)
        if total_habit_actions > 0
        else 0.0
    )

    return {
        "task_total": task_total,
        "task_succeeded": task_succeeded,
        "task_failed": task_failed,
        "task_in_progress": task_in_progress,
        "task_pending": task_pending,
        "task_completion_rate": task_completion_rate,
        "habit_total": habit_total,
        "habit_agg": habit_agg,
        "habit_completion_rate": habit_completion_rate,
    }


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def task_tracking_detail(request, task_id):
    task = get_object_or_404(Task, id=task_id, user=request.user)
    tracking, _ = TaskTracking.objects.get_or_create(task=task)
    return Response({"success": True, "data": TaskTrackingSerializer(tracking).data})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def habit_tracking_detail(request, habit_id):
    habit = get_object_or_404(Habit, id=habit_id, user=request.user)
    tracking, _ = HabitTracking.objects.get_or_create(habit=habit)
    return Response({"success": True, "data": HabitTrackingSerializer(tracking).data})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def tracking_summary(request):
    s = _compute_summary(request.user)
    return Response({
        "success": True,
        "data": {
            "tasks": {
                "total": s["task_total"],
                "succeeded": s["task_succeeded"],
                "failed": s["task_failed"],
                "in_progress": s["task_in_progress"],
                "pending": s["task_pending"],
                "completion_rate": s["task_completion_rate"],
            },
            "habits": {
                "total": s["habit_total"],
                "max_streak": s["habit_agg"]["max_streak"] or 0,
                "total_succeeded": s["habit_agg"]["total_succeeded"] or 0,
                "completion_rate": s["habit_completion_rate"],
            },
        },
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def tracking_dashboard(request):
    s = _compute_summary(request.user)
    current_streak = s["habit_agg"]["current_streak"] or 0
    streak_bonus = round(min(current_streak / 30, 1.0) * 100, 2)
    productivity_score = round(
        (s["task_completion_rate"] * 0.4)
        + (s["habit_completion_rate"] * 0.4)
        + (streak_bonus * 0.2),
        2,
    )
    return Response({
        "success": True,
        "data": {
            "productivity_score": productivity_score,
            "score_breakdown": {
                "task_rate": s["task_completion_rate"],
                "habit_rate": s["habit_completion_rate"],
                "streak_bonus": streak_bonus,
            },
            "tasks": {
                "total": s["task_total"],
                "succeeded": s["task_succeeded"],
                "failed": s["task_failed"],
                "in_progress": s["task_in_progress"],
                "pending": s["task_pending"],
                "completion_rate": s["task_completion_rate"],
            },
            "habits": {
                "total": s["habit_total"],
                "max_streak": s["habit_agg"]["max_streak"] or 0,
                "current_streak": current_streak,
                "total_succeeded": s["habit_agg"]["total_succeeded"] or 0,
                "completion_rate": s["habit_completion_rate"],
            },
        },
    })
