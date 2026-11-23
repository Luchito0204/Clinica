const formularioLogin = document.getElementById("formularioLogin");
const mensajeLogin = document.getElementById("mensajeLogin");

if (formularioLogin) {
    formularioLogin.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const tipo = document.getElementById("tipoProveedor")?.value || "INTERNO";

        if (mensajeLogin) {
            mensajeLogin.textContent = "Verificando credenciales...";
        }

        try {
            const respuesta = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    tipo: tipo
                })
            });

            const datos = await respuesta.json().catch(() => ({}));

            if (!respuesta.ok || !datos.token) {
                throw new Error(datos.error || "Credenciales incorrectas");
            }

            const rolNormalizado = (datos.usuario || "USUARIO").toUpperCase();
            sessionStorage.setItem("token", datos.token);
            sessionStorage.setItem("rol", rolNormalizado);
            sessionStorage.setItem("username", datos.username || username);

            if (mensajeLogin) {
                mensajeLogin.textContent = "¡Inicio de sesión exitoso!";
            }

            if (rolNormalizado === "ADMIN" || rolNormalizado === "ADMINISTRADOR") {
                window.location.href = "index.html";
            } else {
                window.location.href = "usuario.html";
            }
        } catch (error) {
            if (mensajeLogin) {
                mensajeLogin.textContent = error.message;
            }
            console.error(error);
        }
    });
}