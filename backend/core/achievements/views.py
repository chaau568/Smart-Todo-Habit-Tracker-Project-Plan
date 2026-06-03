from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from achievements.models import Achievement, UserAchievement
from achievements.serializers import AchievementSerializer, UserAchievementSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def achievement_list(request):
    if request.method == "GET":
        achievements = Achievement.objects.filter(is_active=True).order_by("rank", "title")
        serializer = AchievementSerializer(achievements, many=True)
        return Response({"success": True, "data": {"results": serializer.data, "count": achievements.count()}})

    if not IsAdminUser().has_permission(request, None):
        raise PermissionDenied()

    serializer = AchievementSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    achievement = Achievement.objects.create(created_by=request.user, **serializer.validated_data)
    return Response(
        {"success": True, "data": AchievementSerializer(achievement).data, "message": "Achievement created."},
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def achievement_detail(request, achievement_id):
    achievement = get_object_or_404(Achievement, id=achievement_id)

    if request.method == "GET":
        return Response({"success": True, "data": AchievementSerializer(achievement).data})

    if not IsAdminUser().has_permission(request, None):
        raise PermissionDenied()

    if request.method == "DELETE":
        achievement.delete()
        return Response({"success": True, "data": None, "message": "Achievement deleted."})

    serializer = AchievementSerializer(achievement, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response({"success": True, "data": AchievementSerializer(achievement).data, "message": "Achievement updated."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_achievements(request):
    user_achievements = (
        UserAchievement.objects.filter(user=request.user)
        .select_related("achievement")
        .order_by("-unlocked_at")
    )
    serializer = UserAchievementSerializer(user_achievements, many=True)
    return Response({"success": True, "data": {"results": serializer.data, "count": user_achievements.count()}})
