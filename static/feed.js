let xhr = new XMLHttpRequest();

let cookie = document.cookie;
let csrfToken = cookie.substring(cookie.indexOf('=') + 1);

xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            posts = JSON.parse(xhr.responseText);
            console.log(posts);
            posts.forEach(function(post, i, arr) {
                postHTML = template.format(
                    post.user.name, //0
                    post.user.avatar_url, //1
                    post.post_time, //2
                    post.text, //3
                    post.user.profile_url, //4
                    post.like_count, //5
                    post.post_id, //6
                    post.is_liked ? "bx bxs-heart" : "bx bx-heart" //7
                );
                document.getElementById("feed").innerHTML += postHTML
            });
            add_comments()
        }
    }
};

let template = "<div id=\"post_container{6}\"><div  class=\"post-container\">\n" +
    "                <div class=\"post-row\">\n" +
    "                    <div class=\"user-profile\">\n" +
    "                        <a href=\"{4}\">  " +
    "                           <img src=\"{1}\" >\n" +
    "                        </a>" +
    "                        <div>\n" +
    "                             <p>{0}</p>\n" +
    "                            <span>{2}</span>\n" +
    "                        </div>\n" +
    "                </div>\n" +
    "                <i class='bx bx-trash' style=\"cursor:pointer\" onclick=remove_post({6})></i>\n" +
    "                </div>\n" +
    "                <p class=\"post-text\">{3}</p>\n" +
    "\n" +
    "                <div class=\"post-row\">\n" +
    "                    <div class=\"activity-icons\">\n" +
    "                            <div id='post{6}'><i class='{7}' onclick=make_like({6})></i><span >{5}</span></div>\n" +
    "                            <div><i class='bx bx-comment-detail'></i>45</div>\n" +
    "                            <div><i class='bx bx-share' ></i>20</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"post-profile-icon\">\n" +
    "                        <img src=\"{1}\"><i class='bx bx-caret-down'></i>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "           \n" +
    "            </div></div>";

let comment_template = `<div class="post-comment-form">
<input type="text" placeholder="Оставить комментарий"><i class='bx bxs-send'></i>

</div>
<!-- POST COMMENT -->
<div class="post-comment">
<div class="post-row">
    <div class="user-profile">
        <img src="/static/images/profile-11.png">
        <div>
            <p>{0}</p>
            <span>2 апреля 2022, 10:00</span>
        </div>
    </div>
    <a href="#"><i class='bx bx-trash' ></i></a>
</div>
<p class="post-text">Тестовый комментарий. Можете идти дальше. <a href="#">#Test</a></p>

</div>`

function add_comments() {
    document.getElementById("post_container26").innerHTML += comment_template
}


function make_like(post_id) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let post_like = document.getElementById("post" + post_id);
                console.log(post_like.childNodes[0].className);
                if (post_like.childNodes[0].className === "bx bx-heart") {
                    post_like.childNodes[0].className = 'bx bxs-heart';
                } else {
                    post_like.childNodes[0].className = "bx bx-heart";
                }
                post_like.childNodes[1].innerText = xhr.responseText;
            }
        }
    };
    xhr.open("POST", "/feed/make_like", true);
    let data = new FormData();
    data.append("post_id", post_id);
    xhr.setRequestHeader("X-CSRFToken", csrfToken);
    xhr.send(data);
}


xhr.open("GET", "/feed/get_posts?time=now", true);
xhr.setRequestHeader("X-CSRFToken", csrfToken);
xhr.send();

String.prototype.format = function() {
    // store arguments in an array
    let args = arguments;
    // use replace to iterate over the string
    // select the match and check if related argument is present
    // if yes, replace the match with the argument
    return this.replace(/{([0-9]+)}/g, function(match, index) {
        // check if the argument is present
        return typeof args[index] == 'undefined' ? match : args[index];
    });
};

function remove_post(post_id) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) { document.getElementById("post_container" + post_id).remove(); }
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
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}