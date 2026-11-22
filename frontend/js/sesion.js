
function verificarSesion() {
    const token = sessionStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
    }
}

function cerrarSesion() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("rol");

    window.location.href = "login.html";
}
