import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("tasks", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="TaskLog",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("action", models.CharField(
                    choices=[
                        ("created", "Created"),
                        ("completed", "Completed"),
                        ("canceled", "Canceled"),
                        ("deleted", "Deleted"),
                    ],
                    max_length=20,
                )),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("task", models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name="logs",
                    to="tasks.task",
                )),
            ],
            options={
                "db_table": "task_logs",
                "indexes": [models.Index(fields=["task", "-created_at"], name="task_logs_task_created_idx")],
            },
        ),
    ]
