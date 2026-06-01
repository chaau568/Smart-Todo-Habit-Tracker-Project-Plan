from django.conf import settings
from django.db import models

from shared.models import BaseModel


class Category(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='categories',
    )
    name = models.CharField(max_length=100)

    class Meta(BaseModel.Meta):
        db_table = 'categories'
        unique_together = [['user', 'name']]

    def __str__(self):
        return self.name
