from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed


class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user = super().get_user(validated_token)
        if user.status == "deleted":
            raise AuthenticationFailed("User account has been deleted.")
        if not user.is_active:
            raise AuthenticationFailed("User account is inactive.")
        return user
