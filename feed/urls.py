from django.urls import path

from feed.views import make_post, get_post, make_like, delete_post, make_comment, delete_comment

urlpatterns = [
    path("make_post", make_post),
    path("get_posts", get_post),
    path("make_like", make_like),
    path("remove_post", delete_post),
    path("make_comment", make_comment),
    path("delete_comment", delete_comment),
]
