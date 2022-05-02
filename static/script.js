var settingsmenu = document.querySelector(".settings-menu");
var darkBtn = document.getElementById("dark-btn");


function settingsMenuToggle() {
    settingsmenu.classList.toggle("settings-menu-height");
}

darkBtn.onclick = function() {
    darkBtn.classList.toggle("dark-btn-on");
    document.body.classList.toggle("light-theme");

    if (localStorage.getItem("theme") == "dark") {
        localStorage.setItem("theme", "light");
    } else {
        localStorage.setItem("theme", "dark");
    }
};

if (localStorage.getItem("theme") == "dark") {
    darkBtn.classList.remove("dark-btn-on");
    document.body.classList.remove("light-theme");
} else if (localStorage.getItem("theme") == "light") {
    darkBtn.classList.add("dark-btn-on");
    document.body.classList.add("light-theme");
} else {
    localStorage.setItem("theme", "dark");
}

// const setmenu = document.getElementById(setmenu);
// const setmenu2 = document.getElementById('setmenu2')
// toggle.onclick = function() {
//     toggle.classList.toggle('active');
//     toggle.classList.toggle('active')
// }


// PASSWORD SHOW/HIDE
const toggle = document.querySelector(".toggle"),
    pass = document.querySelector("#pass");

toggle.addEventListener("click", () => {
    if (pass.type === "password") {
        pass.type = "text";
        toggle.classList.replace("uil-eye-slash", "uil-eye");
    } else {
        pass.type = "password";
        toggle.classList.replace("uil-eye", "uil-eye-slash");
    }
});

// Events cards scroll