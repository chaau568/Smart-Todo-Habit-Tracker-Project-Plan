from django.db import models


class TaskTracking(models.Model):
    task = models.OneToOneField(
        "tasks.Task",
        on_delete=models.CASCADE,
        related_name="tracking",
    )
    time_succeeded = models.PositiveIntegerField(default=0)
    time_failed = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "task_tracking"

    def __str__(self):
        return f"Tracking: {self.task.title}"

    @property
    def progress(self):
        total = self.time_succeeded + self.time_failed
        return round(self.time_succeeded / total * 100, 2) if total > 0 else 0.0

    def increment_success(self):
        self.time_succeeded += 1
        self.save()

    def increment_failure(self):
        self.time_failed += 1
        self.save()


class HabitTracking(models.Model):
    habit = models.OneToOneField(
        "habits.Habit",
        on_delete=models.CASCADE,
        related_name="tracking",
    )
    time_succeeded = models.PositiveIntegerField(default=0)
    time_failed = models.PositiveIntegerField(default=0)
    streak_count = models.PositiveIntegerField(default=0)
    max_streak = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "habit_tracking"

    def __str__(self):
        return f"Tracking: {self.habit.title}"

    @property
    def progress(self):
        total = self.time_succeeded + self.time_failed
        return round(self.time_succeeded / total * 100, 2) if total > 0 else 0.0

    def increment_success(self):
        self.time_succeeded += 1
        self.streak_count += 1
        if self.streak_count > self.max_streak:
            self.max_streak = self.streak_count
        self.save()

    def increment_failure(self):
        self.time_failed += 1
        self.save()

    def reset_streak(self):
        self.streak_count = 0
        self.save()
