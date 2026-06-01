from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.serializers.register_serializers import RegisterSerializer
from authentication.services import AuthService


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = AuthService.register_user(serializer.validated_data)
        return Response(
            {
                'success': True,
                'data': {
                    'id': str(user.id),
                    'username': user.username,
                    'email': user.email,
                },
                'message': 'Account created successfully.',
            },
            status=status.HTTP_201_CREATED,
        )
