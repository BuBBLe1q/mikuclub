from django.db import models

# Create your models here.
from accounts.models import CustomUser


class Post(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    text = models.TextField(max_length=200)
    post_time = models.DateTimeField(auto_now=True)

    like_count = models.IntegerField(default=0)

    class Meta:
        indexes = [
            models.Index(fields=["post_time"])
        ]

    # TODO image

    pass


class Likes(models.Model):
    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)

    class Meta:
        indexes = [
            models.Index(fields=["user_id", "post_id"])
        ]
