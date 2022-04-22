import time

import django.http
from django.core.files.images import get_image_dimensions
from django.http import HttpResponse, HttpResponseBadRequest


def upload_avatar(request):
    current_user = request.user
    if request.method == "POST" and current_user.is_authenticated:
        image = request.FILES["file"]

        if image.size > 5120000:
            return django.http.HttpResponseBadRequest("image to big")

        dim = get_image_dimensions(image)

        if dim[0] > 1500 or dim[1] > 1500:
            return django.http.HttpResponseBadRequest("image to big")

        image.name = str(round(time.time())) + current_user.username

        if str(current_user.avatar) != "":
            current_user.avatar.storage.delete(current_user.avatar.name)

        current_user.avatar = image
        current_user.save()
        return HttpResponse(current_user.avatar.url)
    else:
        print("error")
    return HttpResponseBadRequest()
