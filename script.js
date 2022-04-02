var settingsmenu = document.querySelector(".settings-menu");
var darkBtn = document.getElementById("dark-btn");



    
function settingsMenuToggle(){
        settingsmenu.classList.toggle("settings-menu-height");
}
darkBtn.onclick = function(){
    darkBtn.classList.toggle("dark-btn-on");
    document.body.classList.toggle("light-theme");

    if(localStorage.getItem("theme") == "dark"){
        localStorage.setItem("theme", "light");
    }
    else{
        localStorage.setItem("theme", "dark");
    }
}

if(localStorage.getItem("theme") == "dark"){
    darkBtn.classList.remove("dark-btn-on");
    document.body.classList.remove("light-theme");
}
else if(localStorage.getItem("theme") == "light"){
    darkBtn.classList.add("dark-btn-on");
    document.body.classList.add("light-theme");
}
else{
    localStorage.setItem("theme", "dark");
}
