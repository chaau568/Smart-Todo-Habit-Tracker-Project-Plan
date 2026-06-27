from django.db.models import Case, IntegerField, Value, When
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from achievements.models import Achievement, UserAchievement
from achievements.serializers import AchievementSerializer, UserAchievementSerializer

RANK_ORDER = Case(
    When(rank="COMMON", then=Value(0)),
    When(rank="RARE", then=Value(1)),
    When(rank="EPIC", then=Value(2)),
    When(rank="LEGENDARY", then=Value(3)),
    default=Value(4),
    output_field=IntegerField(),
)


def _require_admin(request):
    if request.user.role != "admin":
        raise PermissionDenied("Admin access required.")


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def achievement_list(request):
    if request.method == "GET":
        if request.user.role == "admin":
            achievements = Achievement.objects.annotate(rank_order=RANK_ORDER).order_by("rank_order", "title")
        else:
            achievements = Achievement.objects.filter(is_active=True).annotate(rank_order=RANK_ORDER).order_by("rank_order", "title")
        serializer = AchievementSerializer(achievements, many=True)
        return Response({"success": True, "data": {"results": serializer.data, "count": achievements.count()}})

    _require_admin(request)

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

    _require_admin(request)

    if request.method == "DELETE":
        achievement.soft_delete()
        return Response({"success": True, "data": None, "message": "Achievement deactivated."})

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
