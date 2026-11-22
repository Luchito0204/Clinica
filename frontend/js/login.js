
const formularioLogin = document.getElementById("formularioLogin");
const mensajeLogin = document.getElementById("mensajeLogin");

formularioLogin.addEventListener("submit", async function(event) {

    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const tipo = document.getElementById("tipoProveedor").value;

    mensajeLogin.textContent = "Verificando credenciales...";

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

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.error || "Credenciales incorrectas");
        }

        sessionStorage.setItem("token", datos.token);
        sessionStorage.setItem("rol", datos.usuario);

        mensajeLogin.textContent = "¡Inicio de sesión exitoso!";

        window.location.href = "index.html";

    } catch (error) {

        mensajeLogin.textContent = error.message;
        console.error(error);

    }

});
