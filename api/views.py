import time

import django.http
from django.core.files.images import get_image_dimensions
from django.http import HttpResponse
from django.shortcuts import render


# Create your views here.
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt


# @csrf_exempt
def upload_avatar(request):
    current_user = request.user
    if request.method == "POST" and current_user.is_authenticated:
        image = request.FILES["file"]
        # print(.name)

        # if request.FILES["file"].size > 204800:
        #     return HttpResponse("image to big", 403)

        # print("size", django.core.files.images.get_image_dimensions(request.FILES["file"]))

        if image.size > 5120000:
            # response = HttpResponse("image to big", content_type='text/plain')
            # response.status_code = 403
            return django.http.HttpResponseBadRequest("image to big")

        dim = get_image_dimensions(image)

        if dim[0] > 1500 or dim[1] > 1500:
            response = HttpResponse("image to big", content_type='text/plain')
            # response.status_code = 403
            return django.http.HttpResponseBadRequest("image to big")

        image.name = str(round(time.time())) + current_user.username

        if str(current_user.avatar) != "":
            current_user.avatar.storage.delete(current_user.avatar.name)

        current_user.avatar = image
        current_user.save()
    else:
        print("error")
    return HttpResponse("", 200)
