from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, HttpResponseForbidden
from accounts.models import CustomUser
from feed.Forms import PostForm
from feed.models import Post, Likes


def make_post(request):
    current_user = request.user
    if request.method == "POST" and current_user.is_authenticated:
        form = PostForm(request.POST)

        if form.is_valid():
            post = Post()
            post.user = current_user
            post.text = form.cleaned_data['text']
            post.save()

    return HttpResponseRedirect("/")


def get_post(request):
    current_user = request.user
    if request.method == "GET" and current_user.is_authenticated:

        posts = []
        for post_raw in Post.objects.order_by("-post_time")[:10].values():
            user = CustomUser.objects.get(pk=post_raw["user_id"])
            ava = None
            if not user.avatar:
                ava = ""
            else:
                ava = user.avatar.url

            is_liked = Likes.objects.filter(user_id=current_user, post_id=post_raw['id']).exists()
            post = {
                "post_id": post_raw['id'],
                "user": {
                    "name": user.username,
                    "avatar_url": ava,
                    "profile_url": "/profile?id=" + str(user.id)
                },
                # "avatar": ava,
                "text": post_raw['text'],
                "post_time": post_raw['post_time'],
                "like_count": post_raw['like_count'],
                "is_liked": is_liked
            }
            posts.append(post)

        return JsonResponse(posts, safe=False)

    return HttpResponse("", 200)


def delete_post(request, post_id=None):
    current_user = request.user
    if request.method == "POST" and current_user.is_authenticated:
        post_id = request.POST["post_id"]
        post_to_delete = Post.objects.get(pk=post_id)
        if post_to_delete.user_id == current_user.id:
            post_to_delete.delete()
        else:
            return HttpResponseForbidden("")
    return HttpResponse(200)


def make_like(request):
    current_user = request.user
    if request.method == "POST" and current_user.is_authenticated:
        if request.POST["post_id"] is not None:
            post_id = request.POST["post_id"]
            like = Likes.objects.filter(user_id=current_user, post_id=post_id)
            post = Post.objects.get(pk=post_id)
            if like.exists():
                print("like exist. deleting: ", post_id)
                like.delete()
                post.like_count -= 1
                post.save()
                return HttpResponse(post.like_count, content_type="text/plain")

            print("like not exist. adding: ", post_id)

            like = Likes()
            like.user_id = current_user
            like.post_id = post
            like.save()

            post.like_count += 1
            post.save()
            return HttpResponse(post.like_count, content_type="text/plain")

    return HttpResponse(200)
