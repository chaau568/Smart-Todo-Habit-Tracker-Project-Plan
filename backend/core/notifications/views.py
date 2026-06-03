from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from notifications.models import Notification
from notifications.serializers import NotificationSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def notification_list(request):
    notifications = Notification.objects.filter(user=request.user).order_by("-created_at")
    serializer = NotificationSerializer(notifications, many=True)
    return Response({"success": True, "data": {"results": serializer.data, "count": notifications.count()}})


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
