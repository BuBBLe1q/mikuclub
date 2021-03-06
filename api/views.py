import time

import django.http
from django.contrib.auth.decorators import login_required
from django.core.files.images import get_image_dimensions
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render


# Create your views here.
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt


# @csrf_exempt
def upload_avatar(request):
    current_user = request.user
    if request.method == "POST" and current_user.is_authenticated:
        image = request.FILES["file"]

        if image.size > 5120000:
            return django.http.HttpResponseBadRequest("image to big")

        dim = get_image_dimensions(image)

        if dim[0] > 1500 or dim[1] > 1500:
            return HttpResponseBadRequest("image to big")

        image.name = str(round(time.time())) + current_user.username

        if str(current_user.avatar) != "":
            current_user.avatar.storage.delete(current_user.avatar.name)

        current_user.avatar = image
        current_user.save()
    else:
        print("error")
    return HttpResponse("", 200)


@login_required
def update_bio(request):
    current_user = request.user
    if request.method == "POST" and request.POST["text"] is not None:
        current_user.bio = request.POST["text"]
        current_user.save()
        return HttpResponse()
    return HttpResponseBadRequest()
