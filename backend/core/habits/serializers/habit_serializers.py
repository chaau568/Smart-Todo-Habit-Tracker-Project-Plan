from django.utils import timezone
from rest_framework import serializers

from categories.models import Category
from habits.models import Habit, HabitLog


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

    def validate(self, attrs):
        start = attrs.get("start_date", self.instance.start_date if self.instance else None)
        end = attrs.get("end_date", self.instance.end_date if self.instance else None)
        if start and end and end < start:
            raise serializers.ValidationError({"end_date": "End date must be on or after start date."})
        return attrs


class HabitReadSerializer(serializers.ModelSerializer):
    category = CategoryInlineSerializer(read_only=True)
    checked_in_today = serializers.SerializerMethodField()
    skipped_today = serializers.SerializerMethodField()

    class Meta:
        model = Habit
        fields = [
            "id", "title", "description", "category",
            "start_date", "end_date", "time_periods",
            "status", "note", "created_at", "updated_at",
            "checked_in_today", "skipped_today",
        ]

    def get_checked_in_today(self, obj):
        if hasattr(obj, "checked_in_today"):
            return obj.checked_in_today
        return HabitLog.objects.filter(
            habit=obj, completed_date=timezone.localdate(), action=HabitLog.Action.CHECKED_IN
        ).exists()

    def get_skipped_today(self, obj):
        if hasattr(obj, "skipped_today"):
            return obj.skipped_today
        return HabitLog.objects.filter(
            habit=obj, completed_date=timezone.localdate(), action=HabitLog.Action.SKIPPED
        ).exists()
