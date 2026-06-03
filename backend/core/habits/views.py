from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from habits.models import Habit, HabitLog
from habits.serializers import HabitCreateSerializer, HabitReadSerializer, HabitUpdateSerializer
from habits.services import HabitService


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def habit_list(request):
    if request.method == "GET":
        habits = Habit.objects.filter(user=request.user).exclude(status=Habit.Status.DELETED).order_by("-created_at")
        serializer = HabitReadSerializer(habits, many=True)
        return Response({"success": True, "data": {"results": serializer.data, "count": habits.count()}})

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
    if habit.status == Habit.Status.SUCCEEDED:
        return Response(
            {"success": False, "error": {"code": "ALREADY_CHECKED_IN", "message": "Already checked in for today."}},
            status=status.HTTP_400_BAD_REQUEST,
        )

    habit = HabitService.check_in(habit)
    return Response({"success": True, "data": HabitReadSerializer(habit).data, "message": "Check-in recorded."})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def habit_skip(request, habit_id):
    habit = get_object_or_404(Habit, id=habit_id, user=request.user)

    if habit.status in (Habit.Status.DELETED, Habit.Status.SUCCEEDED):
        return Response(
            {"success": False, "error": {"code": "INVALID_STATUS", "message": f"Cannot skip a {habit.status} habit."}},
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
        {"id": log.id, "completed_date": log.completed_date, "created_at": log.created_at}
        for log in logs
    ]
    return Response({
        "success": True,
        "data": {"results": results, "count": logs.count()},
    })
