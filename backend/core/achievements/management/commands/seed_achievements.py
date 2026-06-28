"""
Seed achievements into the database.

Usage:
    python manage.py seed_achievements
    python manage.py seed_achievements --clear   # ลบเก่าแล้ว insert ใหม่
"""

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

from achievements.models import Achievement

User = get_user_model()

# fmt: off
ACHIEVEMENTS = [
    # ─────────────────────────── TASK ───────────────────────────
    # metric: task_succeeded_count

    # COMMON
    {
        "title": "First Step",
        "description": "Complete your very first task. Every journey starts here.",
        "rank": "COMMON",
        "type": "task",
        "condition": {"metric": "task_succeeded_count", "operator": ">=", "value": 1},
    },
    {
        "title": "Getting Started",
        "description": "Complete 5 tasks. You're building momentum.",
        "rank": "COMMON",
        "type": "task",
        "condition": {"metric": "task_succeeded_count", "operator": ">=", "value": 5},
    },

    # RARE
    {
        "title": "Task Hustler",
        "description": "Complete 15 tasks — you're not messing around.",
        "rank": "RARE",
        "type": "task",
        "condition": {"metric": "task_succeeded_count", "operator": ">=", "value": 15},
    },
    {
        "title": "Productive",
        "description": "Complete 25 tasks. Productivity is becoming a habit.",
        "rank": "RARE",
        "type": "task",
        "condition": {"metric": "task_succeeded_count", "operator": ">=", "value": 25},
    },

    # EPIC
    {
        "title": "Task Pro",
        "description": "Complete 50 tasks. You mean serious business.",
        "rank": "EPIC",
        "type": "task",
        "condition": {"metric": "task_succeeded_count", "operator": ">=", "value": 50},
    },
    {
        "title": "Relentless",
        "description": "Complete 75 tasks without slowing down.",
        "rank": "EPIC",
        "type": "task",
        "condition": {"metric": "task_succeeded_count", "operator": ">=", "value": 75},
    },

    # LEGENDARY
    {
        "title": "Task Legend",
        "description": "Reach 100 completed tasks. A true legend of execution.",
        "rank": "LEGENDARY",
        "type": "task",
        "condition": {"metric": "task_succeeded_count", "operator": ">=", "value": 100},
    },
    {
        "title": "Unstoppable",
        "description": "Complete 200 tasks. Nothing can stop you.",
        "rank": "LEGENDARY",
        "type": "task",
        "condition": {"metric": "task_succeeded_count", "operator": ">=", "value": 200},
    },

    # ─────────────────── HABIT — streak (habit_max_streak) ───────────────────

    # COMMON
    {
        "title": "Habit Spark",
        "description": "Keep any habit going for 3 days in a row.",
        "rank": "COMMON",
        "type": "habit",
        "condition": {"metric": "habit_max_streak", "operator": ">=", "value": 3},
    },
    {
        "title": "Week Warrior",
        "description": "Maintain a 7-day habit streak. One full week done.",
        "rank": "COMMON",
        "type": "habit",
        "condition": {"metric": "habit_max_streak", "operator": ">=", "value": 7},
    },

    # RARE
    {
        "title": "Fortnight Strong",
        "description": "Keep a habit going for 14 days straight.",
        "rank": "RARE",
        "type": "habit",
        "condition": {"metric": "habit_max_streak", "operator": ">=", "value": 14},
    },
    {
        "title": "Month Champion",
        "description": "Hit a 30-day habit streak. One full month of discipline.",
        "rank": "RARE",
        "type": "habit",
        "condition": {"metric": "habit_max_streak", "operator": ">=", "value": 30},
    },

    # EPIC
    {
        "title": "Iron Discipline",
        "description": "Reach a 60-day habit streak. Your willpower is exceptional.",
        "rank": "EPIC",
        "type": "habit",
        "condition": {"metric": "habit_max_streak", "operator": ">=", "value": 60},
    },
    {
        "title": "Quarter Century",
        "description": "90 days of unwavering commitment. A full quarter.",
        "rank": "EPIC",
        "type": "habit",
        "condition": {"metric": "habit_max_streak", "operator": ">=", "value": 90},
    },

    # LEGENDARY
    {
        "title": "Half Year Hero",
        "description": "180-day streak — half a year of pure discipline.",
        "rank": "LEGENDARY",
        "type": "habit",
        "condition": {"metric": "habit_max_streak", "operator": ">=", "value": 180},
    },
    {
        "title": "Year of Habits",
        "description": "365-day streak. You've transformed your life completely.",
        "rank": "LEGENDARY",
        "type": "habit",
        "condition": {"metric": "habit_max_streak", "operator": ">=", "value": 365},
    },

    # ──────────────── HABIT — total check-ins (habit_succeeded_count) ─────────────────

    # COMMON
    {
        "title": "First Check-In",
        "description": "Complete your first habit check-in. The hardest step is the first.",
        "rank": "COMMON",
        "type": "habit",
        "condition": {"metric": "habit_succeeded_count", "operator": ">=", "value": 1},
    },
    {
        "title": "Consistency Begins",
        "description": "Accumulate 10 habit check-ins across all habits.",
        "rank": "COMMON",
        "type": "habit",
        "condition": {"metric": "habit_succeeded_count", "operator": ">=", "value": 10},
    },

    # RARE
    {
        "title": "30 Check-Ins",
        "description": "30 total check-ins — the habit is truly forming.",
        "rank": "RARE",
        "type": "habit",
        "condition": {"metric": "habit_succeeded_count", "operator": ">=", "value": 30},
    },
    {
        "title": "Consistent",
        "description": "Rack up 60 habit check-ins. Consistency is your superpower.",
        "rank": "RARE",
        "type": "habit",
        "condition": {"metric": "habit_succeeded_count", "operator": ">=", "value": 60},
    },

    # EPIC
    {
        "title": "Century Club",
        "description": "100 total habit check-ins. Welcome to the club.",
        "rank": "EPIC",
        "type": "habit",
        "condition": {"metric": "habit_succeeded_count", "operator": ">=", "value": 100},
    },
    {
        "title": "Dedicated",
        "description": "250 total check-ins — dedication has become your identity.",
        "rank": "EPIC",
        "type": "habit",
        "condition": {"metric": "habit_succeeded_count", "operator": ">=", "value": 250},
    },

    # LEGENDARY
    {
        "title": "500 Club",
        "description": "500 habit check-ins. An absolute legend of consistency.",
        "rank": "LEGENDARY",
        "type": "habit",
        "condition": {"metric": "habit_succeeded_count", "operator": ">=", "value": 500},
    },
    {
        "title": "Habit Master",
        "description": "1,000 check-ins. Habits are your superpower.",
        "rank": "LEGENDARY",
        "type": "habit",
        "condition": {"metric": "habit_succeeded_count", "operator": ">=", "value": 1000},
    },
]
# fmt: on


class Command(BaseCommand):
    help = "Seed achievements into the database"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Delete all existing achievements before seeding",
        )

    def handle(self, *args, **options):
        admin = User.objects.filter(is_superuser=True).first()
        if not admin:
            raise CommandError(
                "No superuser found. Run `python manage.py createsuperuser` first."
            )

        if options["clear"]:
            deleted, _ = Achievement.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Deleted {deleted} existing achievements."))

        created = 0
        skipped = 0

        for data in ACHIEVEMENTS:
            _, was_created = Achievement.objects.get_or_create(
                title=data["title"],
                type=data["type"],
                defaults={
                    "description": data["description"],
                    "rank": data["rank"],
                    "condition": data["condition"],
                    "created_by": admin,
                    "is_active": True,
                },
            )
            if was_created:
                created += 1
            else:
                skipped += 1

        ranks = ["COMMON", "RARE", "EPIC", "LEGENDARY"]
        types = ["task", "habit"]

        self.stdout.write("\n  Rank        Task    Habit")
        self.stdout.write("  " + "-" * 28)
        for rank in ranks:
            row = f"  {rank:<12}"
            for atype in types:
                count = sum(
                    1 for a in ACHIEVEMENTS if a["rank"] == rank and a["type"] == atype
                )
                row += f"  {count:<6}"
            self.stdout.write(row)
        self.stdout.write("  " + "-" * 28)
        self.stdout.write(f"  Total{'':<7}  {sum(1 for a in ACHIEVEMENTS if a['type'] == 'task'):<6}  {sum(1 for a in ACHIEVEMENTS if a['type'] == 'habit')}")

        self.stdout.write(
            self.style.SUCCESS(f"\nDone — created: {created}, skipped (already exist): {skipped}")
        )
