from django.urls import path
from . import views




urlpatterns = [
    path('', views.message, name="messages"),
    # path('<str:room_name>/', views.room, name="room"),
]
