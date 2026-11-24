const ROLES_ADMIN = ["ADMIN", "ADMINISTRADOR"];

function normalizarRol(rol) {
    return (rol || "").toString().trim().toUpperCase();
}

// Panel que le corresponde a cada rol (el rol viene de la tabla usuarios).
function rutaPanelPorRol(rol) {
    const r = normalizarRol(rol);

    if (ROLES_ADMIN.includes(r)) return "index.html";
    if (r === "RECEPCION" || r === "RECEPCIONISTA") return "recepcion.html";
    if (r === "BOTICA") return "botica.html";
    return "usuario.html";
}

function verificarSesion() {
    const token = sessionStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}

// Exige sesión iniciada Y que el rol del usuario pueda ver esta página.
// Si no corresponde, lo manda a su propio panel.
function verificarRol(rolesPermitidos) {
    if (!verificarSesion()) return false;

    const rol = normalizarRol(sessionStorage.getItem("rol"));
    const permitidos = rolesPermitidos.map(normalizarRol);

    if (rol && permitidos.includes(rol)) {
        return true;
    }

    const destino = rutaPanelPorRol(rol);
    const paginaActual = window.location.pathname.split("/").pop();

    // Evita un bucle de redirecciones si el rol no es válido para ningún panel.
    if (!rol || destino === paginaActual) {
        cerrarSesion();
        return false;
    }

    window.location.href = destino;
    return false;
}

function obtenerTokenSesion() {
    return sessionStorage.getItem("token") || "";
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
