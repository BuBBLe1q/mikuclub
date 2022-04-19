let xhr = new XMLHttpRequest();

let cookie = document.cookie;
let csrfToken = cookie.substring(cookie.indexOf('=') + 1);

xhr.onreadystatechange = function () {
    if (xhr.readyState === 4){
        if (xhr.status === 200){
            posts = JSON.parse(xhr.responseText);
            console.log(posts);
            posts.forEach(function (post, i, arr) {
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
        }
    }
};

let template = "<div class=\"post-container\">\n" +
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
    "                <a href=\"#\"><i class='bx bx-dots-vertical-rounded' ></i></a>\n" +
    "                </div>\n" +
    "                <p class=\"post-text\">{3}</p>\n" +
    "\n" +
    "                <div class=\"post-row\">\n" +
    "                    <div class=\"activity-icons\">\n" +
    "                            <div id='post{6}'><i class='{7}' onclick=make_like({6})></i><span >{5}</span></div>\n"  +
    "                            <div><i class='bx bx-comment-detail'></i>45</div>\n" +
    "                            <div><i class='bx bx-share' ></i>20</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"post-profile-icon\">\n" +
    "                        <img src=\"{1}\"><i class='bx bx-caret-down'></i>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "           \n" +
    "            </div>";

function make_like(post_id){
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4){
            if (xhr.status === 200){
                let post_like = document.getElementById("post" + post_id);
                console.log(post_like.childNodes[0].className);
                if (post_like.childNodes[0].className === "bx bx-heart"){
                    post_like.childNodes[0].className = 'bx bxs-heart';
                }else{
                    post_like.childNodes[0].className = "bx bx-heart";
                }
                post_like.childNodes[1].innerText = xhr.responseText;
            }
        }
    };
    xhr.open("POST", "/feed/make_like",true);
    let data = new FormData();
    data.append("post_id", post_id);
    xhr.setRequestHeader("X-CSRFToken", csrfToken);
    xhr.send(data);
}


xhr.open("GET", "/feed/get_posts?time=now",true);
xhr.setRequestHeader("X-CSRFToken", csrfToken);
xhr.send();

String.prototype.format = function () {
    // store arguments in an array
    let args = arguments;
    // use replace to iterate over the string
    // select the match and check if related argument is present
    // if yes, replace the match with the argument
    return this.replace(/{([0-9]+)}/g, function (match, index) {
        // check if the argument is present
        return typeof args[index] == 'undefined' ? match : args[index];
    });
};