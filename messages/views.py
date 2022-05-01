from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, HttpResponseForbidden, HttpResponseBadRequest
from django.shortcuts import get_object_or_404


def messages(request):
   return render(request, 'templates/messages.html')

@login_required
def message(request):
    current_user = request.user
    if request.method == "POST":
        if request.POST["message"] is not None and request.POST["text"] is not None:
            text = request.POST["text"]
            post = get_object_or_404(message)

            if text == "":
                return HttpResponseBadRequest()

            
           