import datetime
import time

from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, HttpResponseForbidden, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from django.shortcuts import render, redirect

from accounts.models import CustomUser
from feed.Forms import PostForm
from feed.models import Post, Likes, Comment


def make_post(request):
    current_user = request.user
    if request.method == "POST" and current_user.is_authenticated:
        form = PostForm(request.POST)

        if form.is_valid():
            post = Post()
            post.user = current_user
            post.text = form.cleaned_data['text']
            post.save()

    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


def get_post(request):
    current_user = request.user
    if request.method == "GET" and current_user.is_authenticated:

        posts = []
        if request.GET.get('user_id') is None:
            posts_raw = Post.objects.order_by("-post_time")[:10].values()
        else:
            posts_raw = Post.objects.filter(user=request.GET.get(
                'user_id')).order_by("-post_time")[:10].values()
        for post_raw in posts_raw:
            user = CustomUser.objects.get(pk=post_raw["user_id"])
            ava = None
            if not user.avatar:
                ava = ""
            else:
                ava = user.avatar.url

            is_liked = Likes.objects.filter(
                user_id=current_user, post_id=post_raw['id']).exists()
            # print(time.mktime(post_raw['post_time']))
            # print(datetime.datetime.timestamp(post_raw['post_time'])*1000)
            post = {
                "post_id": post_raw['id'],
                "user": {
                    "name": user.username,
                    "avatar_url": ava,
                    "profile_url": "/profile?id=" + str(user.id)
                },
                "text": post_raw['text'],
                # "text": datetime.datetime.timestamp(post_raw['text'])*1000,
                # "text": time.mktime(post_raw['text']),
                # "post_time": post_raw['post_time'],
                "post_time": datetime.datetime.timestamp(post_raw['post_time'])*1000,
                "like_count": post_raw['like_count'],
                "comment_count": post_raw['comment_count'],
                "is_liked": is_liked,
                "comments": query_comments(post_raw['id'])
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


@login_required
def make_comment(request):
    # print("makecommnet")
    current_user = request.user
    if request.method == "POST":
        if request.POST["post_id"] is not None and request.POST["text"] is not None:
            post_id = request.POST["post_id"]
            text = request.POST["text"]
            print(text)
            post = get_object_or_404(Post, pk=post_id)

            if text == "":
                return HttpResponseBadRequest()

            post.comment_count += 1
            post.save()

            comment = Comment()
            comment.user = current_user
            comment.post = post
            comment.text = text
            comment.save()
            ava = None
            if not current_user.avatar:
                ava = ""
            else:
                ava = current_user.avatar.url
            return JsonResponse({
                "user": {
                    "name": current_user.username,
                    "avatar_url": ava,
                    "profile_url": "/profile?id=" + str(current_user.id)
                },
                "text": text,
                "comment_time": datetime.datetime.timestamp(comment.comment_time) * 1000
            })
    return HttpResponseBadRequest()


def query_comments(post_id):
    comments = []
    for comment_raw in Comment.objects.filter(post=post_id).order_by("-comment_time").values():
        # print(comment_raw)
        user = CustomUser.objects.get(pk=comment_raw['user_id'])
        ava = None
        if not user.avatar:
            ava = ""
        else:
            ava = user.avatar.url
        comment = {
            "user": {
                "name": user.username,
                "avatar_url": ava,
                "profile_url": "/profile?id=" + str(user.id)
            },
            "text": comment_raw['text'],
            "comment_time": datetime.datetime.timestamp(comment_raw['comment_time']) * 1000,
        }
        comments.append(comment)
    return comments


@login_required
def get_comments(request):
    if request.method != "GET":
        if request.GET.get('post_id') is not None:
            post_id = request.GET.get('post_id')
            comments = query_comments(post_id)
            return JsonResponse(comments)

    return HttpResponseBadRequest()

@login_required
def delete_comment(request, post_id=None):
    current_user = request.user
    if request.method == "POST" and current_user.is_authenticated:
        post_id = request.POST["post_id"]
        post_to_delete = Post.objects.get(pk=post_id)
        if post_to_delete.user_id == current_user.id:
            post_to_delete.delete()
        else:
            return HttpResponseForbidden("")
    return HttpResponse(200)

