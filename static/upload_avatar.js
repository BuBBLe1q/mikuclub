let xhr = new XMLHttpRequest();

let cookie = document.cookie;
let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
function update_avatar(input) {
    let formData = new FormData();
    let file = input.files[0];
    formData.append("file",file);


    xhr.onreadystatechange = function(event){
        // console.log(event.readyState);
        // console.log(xhr.responseText);
        if (xhr.readyState === 4){
            if (xhr.status === 200){
                //TODO добавить обновление изображений
            }else{
                alert(xhr.responseText)
            }
        }
    };


    xhr.open("POST","/api/test",true);
    xhr.setRequestHeader("X-CSRFToken", csrfToken);
    xhr.send(formData);
}