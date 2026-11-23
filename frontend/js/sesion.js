function verificarSesion() {
    const token = sessionStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}

function verificarSesion() {
    const token = sessionStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}

function cerrarSesion() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("rol");
    sessionStorage.removeItem("username");

    window.location.href = "login.html";
}

function actualizarUsuarioTopbar() {
    const rol = sessionStorage.getItem("rol");
    const username = sessionStorage.getItem("username");
    const strong = document.querySelector(".usuario strong");
    const avatar = document.querySelector(".usuario .avatar");

    if (strong) {
        strong.textContent = username || rol || "Usuario";
    }

    if (avatar && (username || rol)) {
        avatar.textContent = (username || rol).trim().charAt(0).toUpperCase();
    }
}

document.addEventListener("DOMContentLoaded", actualizarUsuarioTopbar);
actualizarUsuarioTopbar();