from categories.models import Category


class CategoryService:
    @staticmethod
    def create_category(user, validated_data: dict) -> Category:
        return Category.objects.create(user=user, **validated_data)
