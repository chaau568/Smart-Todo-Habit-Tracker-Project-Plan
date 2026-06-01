from rest_framework import serializers

from categories.models import Category
from tasks.models import Task


class CategoryInlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class TaskCreateSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.none())

    class Meta:
        model = Task
        fields = ['title', 'description', 'category', 'priority', 'start_date', 'due_date']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        if request:
            self.fields['category'].queryset = Category.objects.filter(user=request.user)

    def validate(self, attrs):
        if attrs['start_date'] > attrs['due_date']:
            raise serializers.ValidationError(
                {'due_date': 'Due date must be on or after start date.'}
            )
        return attrs


class TaskUpdateSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.none())

    class Meta:
        model = Task
        fields = ['title', 'description', 'category', 'priority', 'start_date', 'due_date']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        if request:
            self.fields['category'].queryset = Category.objects.filter(user=request.user)

    def validate(self, attrs):
        start = attrs.get('start_date', self.instance.start_date)
        due = attrs.get('due_date', self.instance.due_date)
        if start > due:
            raise serializers.ValidationError(
                {'due_date': 'Due date must be on or after start date.'}
            )
        return attrs


class TaskReadSerializer(serializers.ModelSerializer):
    category = CategoryInlineSerializer(read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'category',
            'status', 'priority', 'start_date', 'due_date',
            'completed_at', 'created_at', 'updated_at',
        ]
