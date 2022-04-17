from django.urls import path

from api.views import upload_avatar

urlpatterns = [
    # path("signup/", SignUpView.as_view(), name="signup"),
    path("test", upload_avatar)
]