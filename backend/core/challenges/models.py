from django.conf import settings
from django.db import models
from django.utils import timezone


class Challenge(models.Model):
    class ChallengeType(models.TextChoices):
        TASK = "task", "Task"
        HABIT = "habit", "Habit"
        MIXED = "mixed", "Mixed"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="owned_challenges",
    )
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    challenge_type = models.CharField(max_length=10, choices=ChallengeType.choices)
    rules = models.JSONField(default=dict)
    start_date = models.DateField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    time_periods = models.PositiveIntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "challenges"

    def __str__(self):
        return self.title

    def close(self):
        self.is_active = False
        self.save()

    def get_leaderboard(self, limit=10):
        return self.participants.select_related("user").order_by("-score")[:limit]


class ChallengeParticipant(models.Model):
    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.CASCADE,
        related_name="participants",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="challenge_participations",
    )
    score = models.IntegerField(default=0)
    joined_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "challenge_participants"
        unique_together = [["challenge", "user"]]

    def __str__(self):
        return f"{self.user} in {self.challenge.title}"

    def update_score(self, amount):
        self.score += amount
        self.save()

    def get_rank(self):
        return (
            ChallengeParticipant.objects.filter(
                challenge=self.challenge,
                score__gt=self.score,
            ).count()
            + 1
        )
