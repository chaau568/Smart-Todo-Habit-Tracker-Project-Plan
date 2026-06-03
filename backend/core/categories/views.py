from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from categories.models import Category
from categories.serializers import CategorySerializer
from categories.services import CategoryService


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def category_list(request):
    if request.method == "GET":
        categories = Category.objects.filter(user=request.user).order_by("-created_at")
        serializer = CategorySerializer(categories, many=True)
        return Response({"success": True, "data": {"results": serializer.data, "count": categories.count()}})

    serializer = CategorySerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    category = CategoryService.create_category(request.user, serializer.validated_data)
    return Response(
        {"success": True, "data": CategorySerializer(category).data, "message": "Category created."},
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def category_detail(request, category_id):
    category = get_object_or_404(Category, id=category_id, user=request.user)

    if request.method == "GET":
        return Response({"success": True, "data": CategorySerializer(category).data})

    if request.method == "DELETE":
        category.delete()
        return Response({"success": True, "data": None, "message": "Category deleted."})

    serializer = CategorySerializer(category, data=request.data, partial=True, context={"request": request})
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response({"success": True, "data": CategorySerializer(category).data, "message": "Category updated."})
