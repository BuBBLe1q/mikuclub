from django.http import HttpResponseNotFound
from django.shortcuts import render, get_object_or_404

from accounts.models import CustomUser


def profile(request):

    if request.method == "GET" and request.GET.get('id') is not None:
        # user = CustomUser.objects.get_object_or_404(pk=int(request.GET.get('id')))
        user = get_object_or_404(CustomUser, pk=int(request.GET.get('id')))
        print(user.username)
        if not user:
            return HttpResponseNotFound("")
        return render(request, "profile.html", {"user": user, "current_user": request.user})
    elif request.user.is_authenticated:
        return render(request, "profile.html", {"user": request.user, "current_user": request.user})
    return HttpResponseNotFound("")
