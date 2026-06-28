from django.db.models import Exists, OuterRef
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.utils import paginate
from habits.models import Habit, HabitLog
from habits.serializers import HabitCreateSerializer, HabitReadSerializer, HabitUpdateSerializer
from habits.services import HabitService


def _annotate_qs(qs):
    today = timezone.localdate()
    checked_in_sq = HabitLog.objects.filter(
        habit=OuterRef("pk"), completed_date=today, action=HabitLog.Action.CHECKED_IN
    )
    skipped_sq = HabitLog.objects.filter(
        habit=OuterRef("pk"), completed_date=today, action=HabitLog.Action.SKIPPED
    )
    return qs.annotate(checked_in_today=Exists(checked_in_sq), skipped_today=Exists(skipped_sq))


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def habit_list(request):
    if request.method == "GET":
        qs = Habit.objects.filter(user=request.user, status=Habit.Status.ACTIVE)
        qs = _annotate_qs(qs)

        daily_status = request.GET.get("daily_status")
        if daily_status == "checked_in":
            qs = qs.filter(checked_in_today=True)
        elif daily_status == "skipped":
            qs = qs.filter(skipped_today=True)
        elif daily_status == "pending":
            qs = qs.filter(checked_in_today=False, skipped_today=False)

        ordering = request.GET.get("ordering", "-created_at")
        if ordering.lstrip("-") in ("start_date", "end_date", "created_at"):
            qs = qs.order_by(ordering)
        else:
            qs = qs.order_by("-created_at")

        items, meta = paginate(qs, request)
        serializer = HabitReadSerializer(items, many=True)
        return Response({"success": True, "data": {**meta, "results": serializer.data}})

    serializer = HabitCreateSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    habit = HabitService.create_habit(request.user, serializer.validated_data)
    return Response(
        {"success": True, "data": HabitReadSerializer(habit).data, "message": "Habit created."},
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def habit_detail(request, habit_id):
    habit = get_object_or_404(Habit, id=habit_id, user=request.user)

    if habit.status == Habit.Status.DELETED:
        return Response(
            {"success": False, "error": {"code": "NOT_FOUND", "message": "Habit not found."}},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        return Response({"success": True, "data": HabitReadSerializer(habit).data})

    if request.method == "DELETE":
        HabitService.soft_delete_habit(habit)
        return Response({"success": True, "data": None, "message": "Habit deleted."})

    serializer = HabitUpdateSerializer(habit, data=request.data, partial=True, context={"request": request})
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response({"success": True, "data": HabitReadSerializer(habit).data, "message": "Habit updated."})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def habit_check_in(request, habit_id):
    habit = get_object_or_404(Habit, id=habit_id, user=request.user)

    if habit.status == Habit.Status.DELETED:
        return Response(
            {"success": False, "error": {"code": "NOT_FOUND", "message": "Habit not found."}},
            status=status.HTTP_404_NOT_FOUND,
        )

    today = timezone.localdate()
    if HabitLog.objects.filter(habit=habit, completed_date=today).exists():
        return Response(
            {"success": False, "error": {"code": "ALREADY_LOGGED_TODAY", "message": "Already logged this habit today."}},
            status=status.HTTP_400_BAD_REQUEST,
        )

    habit = HabitService.check_in(habit)
    return Response({"success": True, "data": HabitReadSerializer(habit).data, "message": "Check-in recorded."})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def habit_skip(request, habit_id):
    habit = get_object_or_404(Habit, id=habit_id, user=request.user)

    if habit.status == Habit.Status.DELETED:
        return Response(
            {"success": False, "error": {"code": "NOT_FOUND", "message": "Habit not found."}},
            status=status.HTTP_404_NOT_FOUND,
        )

    today = timezone.localdate()
    if HabitLog.objects.filter(habit=habit, completed_date=today).exists():
        return Response(
            {"success": False, "error": {"code": "ALREADY_LOGGED_TODAY", "message": "Already logged this habit today."}},
            status=status.HTTP_400_BAD_REQUEST,
        )

    habit = HabitService.skip(habit)
    return Response({"success": True, "data": HabitReadSerializer(habit).data, "message": "Habit skipped."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def habit_history(request, habit_id):
    habit = get_object_or_404(Habit, id=habit_id, user=request.user)
    logs = HabitLog.objects.filter(habit=habit).order_by("-completed_date")
    results = [
        {"id": log.id, "action": log.action, "completed_date": log.completed_date, "created_at": log.created_at}
        for log in logs
    ]
    return Response({
        "success": True,
        "data": {"results": results, "count": logs.count()},
    })
