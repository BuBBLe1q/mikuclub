from django.urls import path

from api.views import upload_avatar, update_bio

urlpatterns = [
    path("upload_avatar", upload_avatar),
    path("update_bio", update_bio)
]