from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from authentication.serializers import (
    ChangePasswordSerializer,
    DeleteAccountSerializer,
    LoginSerializer,
    RegisterSerializer,
    UserProfileSerializer,
    UserUpdateSerializer,
)
from authentication.services import AuthService

User = get_user_model()


def _token_response(user: User) -> dict:
    refresh = RefreshToken.for_user(user)
    return {"access": str(refresh.access_token), "refresh": str(refresh)}


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = AuthService.register_user(serializer.validated_data)
    return Response(
        {
            "success": True,
            "data": UserProfileSerializer(user).data,
            "message": "Account created successfully.",
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    identifier = serializer.validated_data["identifier"]
    password = serializer.validated_data["password"]

    # ถ้า identifier มี @ → ถือเป็น email, ไม่มี @ → ถือเป็น username
    if "@" in identifier:
        user = User.objects.filter(email__iexact=identifier).first()
    else:
        user = User.objects.filter(username__iexact=identifier).first()

    _invalid = Response(
        {"success": False, "error": {"code": "INVALID_CREDENTIALS", "message": "Invalid credentials."}},
        status=status.HTTP_401_UNAUTHORIZED,
    )

    if not user or not user.check_password(password):
        return _invalid

    if user.status == User.Status.DELETED:
        return Response(
            {"success": False, "error": {"code": "ACCOUNT_DELETED", "message": "This account has been deleted."}},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if user.status == User.Status.SUSPENDED:
        return Response(
            {"success": False, "error": {"code": "ACCOUNT_SUSPENDED", "message": "This account is suspended."}},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    tokens = _token_response(user)
    return Response(
        {
            "success": True,
            "data": {**UserProfileSerializer(user).data, **tokens},
            "message": "Login successful.",
        }
    )


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def profile(request):
    if request.method == "GET":
        return Response({"success": True, "data": UserProfileSerializer(request.user).data})

    serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response({"success": True, "data": UserProfileSerializer(request.user).data, "message": "Profile updated."})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    if not request.user.check_password(serializer.validated_data["old_password"]):
        return Response(
            {"success": False, "error": {"code": "WRONG_PASSWORD", "message": "Old password is incorrect."}},
            status=status.HTTP_400_BAD_REQUEST,
        )

    request.user.set_password(serializer.validated_data["new_password"])
    request.user.save()
    return Response({"success": True, "data": None, "message": "Password changed successfully."})


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_account(request):
    serializer = DeleteAccountSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    if not request.user.check_password(serializer.validated_data["password"]):
        return Response(
            {"success": False, "error": {"code": "WRONG_PASSWORD", "message": "Password is incorrect."}},
            status=status.HTTP_400_BAD_REQUEST,
        )

    request.user.soft_delete()
    return Response({"success": True, "data": None, "message": "Account deleted."}, status=status.HTTP_200_OK)
