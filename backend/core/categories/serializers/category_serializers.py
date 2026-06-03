from rest_framework import serializers

from categories.models import Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'title', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_title(self, value):
        user = self.context['request'].user
        qs = Category.objects.filter(user=user, title__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError('You already have a category with this title.')
        return value
