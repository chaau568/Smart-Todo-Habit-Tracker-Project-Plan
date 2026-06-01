from django.contrib.auth import get_user_model

User = get_user_model()


class AuthService:
    @staticmethod
    def register_user(validated_data: dict):
        data = {k: v for k, v in validated_data.items() if k != 'confirm_password'}
        return User.objects.create_user(**data)
