import re

from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

_DIGIT_RE = re.compile(r'\d')
_SPECIAL_CHAR_RE = re.compile(r'[^a-zA-Z0-9\s]')


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        normalized = value.lower()
        if User.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError('This email is already registered.')
        return normalized

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('This username is already taken.')
        return value

    def validate_password(self, value):
        if not _DIGIT_RE.search(value):
            raise serializers.ValidationError('Password must contain at least one digit.')
        if not _SPECIAL_CHAR_RE.search(value):
            raise serializers.ValidationError('Password must contain at least one special character.')
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        return attrs
