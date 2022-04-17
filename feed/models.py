from django.db import models

# Create your models here.
from accounts.models import CustomUser


class Post(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    text = models.TextField(max_length=200)
    post_time = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["post_time"])
        ]

    # TODO image

    pass
