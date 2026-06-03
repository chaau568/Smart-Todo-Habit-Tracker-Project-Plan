from django.contrib.auth import get_user_model

User = get_user_model()


class AuthService:
    @staticmethod
    def register_user(validated_data: dict) -> User:
        validated_data.pop("confirm_password")
        return User.objects.create_user(**validated_data)
