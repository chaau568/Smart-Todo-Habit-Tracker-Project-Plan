from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from core.utils import paginate
from notifications.models import Notification
from notifications.serializers import NotificationSerializer
from notifications.services import NotificationService


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def notification_list(request):
    qs = Notification.objects.filter(user=request.user).order_by("-created_at")
    items, meta = paginate(qs, request)
    serializer = NotificationSerializer(items, many=True)
    return Response({"success": True, "data": {**meta, "results": serializer.data}})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def unread_count(request):
    count = Notification.objects.filter(user=request.user, is_read=False).count()
    return Response({"success": True, "data": {"unread_count": count}})


@api_view(["GET", "DELETE"])
@permission_classes([IsAuthenticated])
def notification_detail(request, notification_id):
    notification = get_object_or_404(Notification, id=notification_id, user=request.user)

    if request.method == "GET":
        return Response({"success": True, "data": NotificationSerializer(notification).data})

    notification.delete()
    return Response({"success": True, "data": None, "message": "Notification deleted."})


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def notification_mark_read(request, notification_id):
    notification = get_object_or_404(Notification, id=notification_id, user=request.user)
    notification.mark_as_read()
    return Response({"success": True, "data": NotificationSerializer(notification).data, "message": "Marked as read."})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def notification_read_all(request):
    updated = Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response({"success": True, "data": {"updated": updated}, "message": "All notifications marked as read."})


@api_view(["POST"])
@permission_classes([AllowAny])
def generate_notifications(request):
    """Called by cron-job.org — protected by X-Cron-Secret header."""
    secret = request.headers.get("X-Cron-Secret", "")
    if not secret or secret != settings.CRON_SECRET:
        return Response(
            {"success": False, "error": {"code": "FORBIDDEN", "message": "Invalid or missing cron secret."}},
            status=status.HTTP_403_FORBIDDEN,
        )

    trigger = request.data.get("trigger")
    if trigger not in ("morning", "evening"):
        return Response(
            {"success": False, "error": {"code": "VALIDATION_ERROR", "message": "trigger must be 'morning' or 'evening'."}},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if trigger == "morning":
        habit_count = NotificationService.generate_morning_habits()
        task_count = NotificationService.generate_task_reminders()
        return Response({
            "success": True,
            "data": {"habits": habit_count, "tasks": task_count},
            "message": "Morning notifications generated.",
        })

    habit_count = NotificationService.generate_evening_habits()
    return Response({
        "success": True,
        "data": {"habits": habit_count, "tasks": 0},
        "message": "Evening notifications generated.",
    })
