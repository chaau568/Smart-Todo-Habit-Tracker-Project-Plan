from django.conf import settings
from django.db import models
from django.utils import timezone


class Achievement(models.Model):
    class Rank(models.TextChoices):
        COMMON = "COMMON", "Common"
        RARE = "RARE", "Rare"
        EPIC = "EPIC", "Epic"
        LEGENDARY = "LEGENDARY", "Legendary"

    class Type(models.TextChoices):
        TASK = "task", "Task"
        HABIT = "habit", "Habit"

    title = models.CharField(max_length=255)
    description = models.TextField()
    rank = models.CharField(max_length=10, choices=Rank.choices, default=Rank.COMMON)
    type = models.CharField(max_length=10, choices=Type.choices)
    condition = models.JSONField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="created_achievements",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "achievements"

    def __str__(self):
        return self.title

    def soft_delete(self):
        self.is_active = False
        self.save()


class UserAchievement(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="user_achievements",
    )
    achievement = models.ForeignKey(
        Achievement,
        on_delete=models.PROTECT,
        related_name="user_achievements",
    )
    unlocked_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "user_achievements"
        unique_together = [["user", "achievement"]]

    def __str__(self):
        return f"{self.user} — {self.achievement.title}"
