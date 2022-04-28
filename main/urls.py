"""main URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

from main import settings
from main.views import profile

urlpatterns = [
    path("", TemplateView.as_view(template_name="index.html"), name="home"),
    path("friends", TemplateView.as_view(template_name="friends.html"), name="friends"),
    path("groups", TemplateView.as_view(template_name="groups.html"), name="groups"),
    path("messages", TemplateView.as_view(template_name="messages.html"), name="messages"),
    path("music", TemplateView.as_view(template_name="music.html"), name="music"),
    path("video", TemplateView.as_view(template_name="video.html"), name="video"),
    path("events", TemplateView.as_view(template_name="events.html"), name="events"),
    
    # path("profile", TemplateView.as_view(template_name="profile.html"), name="profile"),
    path("profile", profile, name="profile"),
    path("admin/", admin.site.urls),
    path("accounts/", include("accounts.urls")),
    path("accounts/", include("django.contrib.auth.urls")),
    path("api/", include("api.urls")),
    path("feed/", include("feed.urls")),
    
]
# + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)