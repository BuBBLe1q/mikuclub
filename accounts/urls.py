from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from .views import SignUpView

urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
]

urlpatterns = [
    # ... 
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
