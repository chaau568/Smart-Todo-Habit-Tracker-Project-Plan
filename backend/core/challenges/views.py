from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from challenges.models import Challenge, ChallengeParticipant
from challenges.serializers import ChallengeParticipantSerializer, ChallengeSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def challenge_list(request):
    if request.method == "GET":
        challenges = Challenge.objects.filter(is_active=True).order_by("-created_at")
        serializer = ChallengeSerializer(challenges, many=True)
        return Response({"success": True, "data": {"results": serializer.data, "count": challenges.count()}})

    serializer = ChallengeSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    challenge = Challenge.objects.create(owner=request.user, **serializer.validated_data)
    return Response(
        {"success": True, "data": ChallengeSerializer(challenge).data, "message": "Challenge created."},
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def challenge_detail(request, challenge_id):
    challenge = get_object_or_404(Challenge, id=challenge_id)

    if request.method == "GET":
        return Response({"success": True, "data": ChallengeSerializer(challenge).data})

    if challenge.owner != request.user:
        return Response(
            {"success": False, "error": {"code": "FORBIDDEN", "message": "Only the owner can modify this challenge."}},
            status=status.HTTP_403_FORBIDDEN,
        )

    if request.method == "DELETE":
        challenge.close()
        return Response({"success": True, "data": None, "message": "Challenge closed."})

    serializer = ChallengeSerializer(challenge, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response({"success": True, "data": ChallengeSerializer(challenge).data, "message": "Challenge updated."})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def challenge_join(request, challenge_id):
    challenge = get_object_or_404(Challenge, id=challenge_id, is_active=True)

    if ChallengeParticipant.objects.filter(challenge=challenge, user=request.user).exists():
        return Response(
            {"success": False, "error": {"code": "ALREADY_JOINED", "message": "You have already joined this challenge."}},
            status=status.HTTP_400_BAD_REQUEST,
        )

    participant = ChallengeParticipant.objects.create(challenge=challenge, user=request.user)
    return Response(
        {"success": True, "data": ChallengeParticipantSerializer(participant).data, "message": "Joined challenge."},
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def challenge_leave(request, challenge_id):
    challenge = get_object_or_404(Challenge, id=challenge_id)
    participant = get_object_or_404(ChallengeParticipant, challenge=challenge, user=request.user)
    participant.delete()
    return Response({"success": True, "data": None, "message": "Left challenge."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def challenge_leaderboard(request, challenge_id):
    challenge = get_object_or_404(Challenge, id=challenge_id)
    participants = challenge.get_leaderboard(limit=10)
    serializer = ChallengeParticipantSerializer(participants, many=True)
    return Response({"success": True, "data": {"results": serializer.data, "challenge": challenge.title}})
