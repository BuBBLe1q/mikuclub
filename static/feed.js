let xhr = new XMLHttpRequest();


let commnet_lock = false;
let like_lock = false;
let last_post_time = null;

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function format_date(unix_d){
    let date = new Date(unix_d);
    let offset = new Date().getTimezoneOffset();
    let date_str =
        date.getFullYear() + "." +
        padTo2Digits((date.getMonth() + 1)) + "." +
        padTo2Digits(date.getDate()) + " " +
        date.toLocaleDateString(undefined, {
            weekday: 'short',
        }) + " " +
        padTo2Digits(date.getHours()) + ":" + padTo2Digits(date.getMinutes());
    return date_str;
}

xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            posts = JSON.parse(xhr.responseText);
            console.log(posts);
            last_post_time = posts[posts.length - 1].post_time;
            posts.forEach(function(post, i, arr) {

                postHTML = template.format(
                    post.user.name, //0
                    post.user.avatar_url, //1
                    format_date(post.post_time), //2
                    post.text, //3
                    post.user.profile_url, //4
                    post.like_count, //5
                    post.post_id, //6
                    post.is_liked ? "bx bxs-heart" : "bx bx-heart", //7
                    post.comment_count //8
                );
                document.getElementById("feed").innerHTML += postHTML;
                post_elem = document.getElementById("post_container" + post.post_id);
                post.comments.forEach(function(comment, i, arr) {
                    commentHTML = comment_template.format(
                        comment.user.avatar_url, //0
                        comment.user.profile_url, //1
                        comment.user.name, //2
                        comment.text, //3
                        format_date(comment.comment_time) //4
                    );
                    post_elem.innerHTML += commentHTML;
                });
                // document.getElementById("post_container" + post.post_id).innerHTML +=
            });
        }
    }
};

function add_posts(posts){

}

let template =
    '<div id="post_container{6}"><div  class="post-container">\n' +
    '                <div class="post-row">\n' +
    '                    <div class="user-profile">\n' +
    '                        <a href="{4}">  ' +
    '                           <img src="{1}" >\n' +
    "                        </a>" +
    "                        <div>\n" +
    "                             <p>{0}</p>\n" +
    "                            <span>{2}</span>\n" +
    "                        </div>\n" +
    "                </div>\n" +
    "                <i class='bx bx-trash' style=\"cursor:pointer\" onclick=remove_post({6})></i>\n" +
    "                </div>\n" +
    '                <p class="post-text">{3}</p>\n' +
    "\n" +
    '                <div class="post-row">\n' +
    '                    <div class="activity-icons">\n' +
    "                            <div id='post{6}'><i class='{7}' onclick=make_like({6})></i><span >{5}</span></div>\n" +
    "                            <div><i class='bx bx-comment-detail'></i>{8}</div>\n" +
    "                            <div><i class='bx bx-share' ></i>20</div>\n" +
    "                    </div>\n" +
    '                    <div class="post-profile-icon">\n' +
    "                        <img src=\"{1}\"><i class='bx bx-caret-down'></i>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "           \n" +
    '</div><div class="post-comment-form">\n' +
    "<input type=\"text\" placeholder=\"Оставить комментарий\"><i class='bx bxs-send' onclick='make_comment(this, {6})'></i>\n" +
    "</div>" +
    "            </div>";

let comment_template = `
<!-- POST COMMENT -->
<div class="post-comment">
<div class="post-row">

    <div class="user-profile">
    <a href="{1}"><img src="{0}"></a>
        <div class="user-info-post">
        <p>{2}</p>
        <span>{4}</span>
        </div>
    </div>
    <div class="options-icon-comment">
    <i class='bx bx-dots-vertical-rounded'></i>
    </div>

</div>

<p class="post-text">{3}</p>

    <form method="GET">
        <input type="button" class="load_more_comments" value="Показать все комментарии">
    </form>


<div class="comment-dd-set">
    <div class="edit-comment">
        <i class='bx bx-edit' ></i>
        <small>Редактировать</small>
    </div>
    <div class="delete-comment">
        <i class='bx bx-trash' ></i>
        <small>Удалить</small>
    </div>
</div>
`;

function add_comments() {
    // document.getElementById("post_container26").innerHTML += comment_template
}

function make_comment(elem, post_id) {
    let xhr = new XMLHttpRequest();
    let text = elem.previousSibling.value;
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                comment = JSON.parse(xhr.responseText);
                commentHTML = comment_template.format(
                    comment.user.avatar_url, //0
                    comment.user.profile_url, //1
                    comment.user.name, //2
                    comment.text, //3
                    format_date(comment.comment_time) //4
                );
                document.getElementById("post_container" + post_id).innerHTML +=
                    commentHTML;
            }
            commnet_lock = false;
        }
    };

    xhr.open("POST", "/feed/make_comment", true);
    let data = new FormData();
    data.append("post_id", post_id);
    data.append("text", text);
    xhr.setRequestHeader("X-CSRFToken", csrfToken);
    xhr.send(data);
    commnet_lock = true;
    // data.append("text",)
}

function make_like(post_id) {
    if (like_lock) {
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let post_like = document.getElementById("post" + post_id);
                console.log(post_like.childNodes[0].className);
                if (post_like.childNodes[0].className === "bx bx-heart") {
                    post_like.childNodes[0].className = "bx bxs-heart";
                } else {
                    post_like.childNodes[0].className = "bx bx-heart";
                }
                post_like.childNodes[1].innerText = xhr.responseText;
            }
            like_lock = false;
        }
    };
    xhr.open("POST", "/feed/make_like", true);
    let data = new FormData();
    data.append("post_id", post_id);
    xhr.setRequestHeader("X-CSRFToken", csrfToken);
    xhr.send(data);
    like_lock = true;
}

function load_posts(time, user_id) {
    let url = "/feed/get_posts?time=" + time;
    if (user_id !== null) {
        url += "&user_id=" + user_id;
    }

    xhr.open("GET", url, true);
    xhr.setRequestHeader("X-CSRFToken", csrfToken);
    xhr.send();
}

String.prototype.format = function() {
    // store arguments in an array
    let args = arguments;
    // use replace to iterate over the string
    // select the match and check if related argument is present
    // if yes, replace the match with the argument
    return this.replace(/{([0-9]+)}/g, function(match, index) {
        // check if the argument is present
        return typeof args[index] == "undefined" ? match : args[index];
    });
};

function remove_post(post_id) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                document.getElementById("post_container" + post_id).remove();
            }
        }
    };
    xhr.open("POST", "/feed/remove_post", true);
    let data = new FormData();
    data.append("post_id", post_id);
    xhr.setRequestHeader("X-CSRFToken", csrfToken);
    xhr.send(data);
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};

window.onscroll = function () {
    let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;
    // console.log(windowRelativeBottom + " " + );
    if(Math.abs(windowRelativeBottom - document.documentElement.clientHeight) <= 1){
        // console.log(last_post_time);
        load_posts(last_post_time,user_id);
    }
    // if (windowRelativeBottom === document.documentElement.clientHeight){
    //     console.log("test");
    // }
};