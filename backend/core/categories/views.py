from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from categories.models import Category
from categories.serializers.category_serializers import CategorySerializer
from categories.services import CategoryService


class CategoryViewSet(ModelViewSet):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        category = CategoryService.create_category(request.user, serializer.validated_data)
        return Response(
            {
                'success': True,
                'data': self.get_serializer(category).data,
                'message': 'Category created.',
            },
            status=status.HTTP_201_CREATED,
        )

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response({'success': True, 'data': serializer.data})

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object())
        return Response({'success': True, 'data': serializer.data})

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'success': True, 'data': serializer.data})

    def destroy(self, request, *args, **kwargs):
        self.get_object().delete()
        return Response({'success': True, 'message': 'Category deleted.'}, status=status.HTTP_200_OK)
