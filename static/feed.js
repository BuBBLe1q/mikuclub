let xhr = new XMLHttpRequest();

let cookie = document.cookie;
let csrfToken = cookie.substring(cookie.indexOf('=') + 1);

xhr.onreadystatechange = function () {
    if (xhr.readyState === 4){
        if (xhr.status === 200){
            // console.log(xhr.responseText);
            posts = JSON.parse(xhr.responseText);
            console.log(posts);
            posts.forEach(function (post, i, arr) {
               postHTML = template.format(post.user.name, post.user.avatar_url, post.post_time,post.text, post.user.profile_url);
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
    "                            <div><i class='bx bx-heart' ></i>120</div>\n" +
    "                            <div><i class='bx bx-comment-detail'></i>45</div>\n" +
    "                            <div><i class='bx bx-share' ></i>20</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"post-profile-icon\">\n" +
    "                        <img src=\"{1}\"><i class='bx bx-caret-down'></i>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "           \n" +
    "            </div>";

// (function () {
//
// })();

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
