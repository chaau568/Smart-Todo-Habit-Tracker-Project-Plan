from rest_framework import serializers

from categories.models import Category
from habits.models import Habit


class CategoryInlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "title"]


class HabitCreateSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.none(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Habit
        fields = ["title", "description", "category", "start_date", "end_date", "time_periods"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request:
            self.fields["category"].queryset = Category.objects.filter(user=request.user)

    def validate(self, attrs):
        start = attrs.get("start_date")
        end = attrs.get("end_date")
        if start and end and end < start:
            raise serializers.ValidationError({"end_date": "End date must be on or after start date."})
        return attrs


class HabitUpdateSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.none(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Habit
        fields = ["title", "description", "category", "start_date", "end_date", "time_periods", "note"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request:
            self.fields["category"].queryset = Category.objects.filter(user=request.user)

    def validate_note(self, value):
        if value and self.instance and self.instance.status != Habit.Status.SUCCEEDED:
            raise serializers.ValidationError("Note can only be added after habit is checked in (SUCCEEDED).")
        return value

    def validate(self, attrs):
        start = attrs.get("start_date", self.instance.start_date if self.instance else None)
        end = attrs.get("end_date", self.instance.end_date if self.instance else None)
        if start and end and end < start:
            raise serializers.ValidationError({"end_date": "End date must be on or after start date."})
        return attrs


class HabitReadSerializer(serializers.ModelSerializer):
    category = CategoryInlineSerializer(read_only=True)

    class Meta:
        model = Habit
        fields = [
            "id", "title", "description", "category",
            "start_date", "end_date", "time_periods",
            "status", "note", "created_at", "updated_at",
        ]
