const API_RECEPCION_PACIENTES = "http://localhost:8080/api/recepcion/pacientes";

const formPaciente = document.getElementById("formPaciente");
const inputFechaNacimiento = document.getElementById("fechaNacimiento");
const inputEdad = document.getElementById("edad");

function fechaHoyISO() {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${hoy.getFullYear()}-${mes}-${dia}`;
}

function calcularEdad(fecha) {
    const [anio, mes, dia] = fecha.split("-").map(Number);
    const hoy = new Date();
    let edad = hoy.getFullYear() - anio;
    const antesDeCumple =
        hoy.getMonth() + 1 < mes ||
        (hoy.getMonth() + 1 === mes && hoy.getDate() < dia);
    if (antesDeCumple) edad--;
    return edad;
}

inputFechaNacimiento.max = fechaHoyISO();

inputFechaNacimiento.addEventListener("change", () => {
    inputEdad.value = inputFechaNacimiento.value
        ? calcularEdad(inputFechaNacimiento.value)
        : "";
});

formPaciente.addEventListener("reset", () => {
    inputEdad.value = "";
});

formPaciente.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dni = document.getElementById("dni").value.trim();
    if (!/^\d{8}$/.test(dni)) {
        alert("El DNI debe tener exactamente 8 dígitos.");
        return;
    }

    const fechaNacimiento = inputFechaNacimiento.value;
    const edad = calcularEdad(fechaNacimiento);

    if (edad < 0) {
        alert("La fecha de nacimiento no puede ser futura.");
        return;
    }

    const paciente = {
        dni: dni,
        nombres: document.getElementById("nombres").value.trim(),
        apellidos: document.getElementById("apellidos").value.trim(),
        fechaNacimiento: fechaNacimiento,
        estadoCivil: document.getElementById("estadoCivil").value,
        edad: edad,
        telefono: document.getElementById("telefono").value.trim(),
        correo: document.getElementById("correo").value.trim()
    };

    try {
        const respuesta = await fetch(API_RECEPCION_PACIENTES, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": obtenerTokenSesion()
            },
            body: JSON.stringify(paciente)
        });

        if (respuesta.status === 401) {
            alert("Tu sesión no es válida. Inicia sesión nuevamente.");
            cerrarSesion();
            return;
        }

        if (!respuesta.ok) {
            const detalle = await respuesta.json().catch(() => ({}));
            throw new Error(detalle.error || ("Código " + respuesta.status));
        }

        alert("Paciente registrado correctamente.");
        formPaciente.reset();

    } catch (error) {
        console.error(error);
        alert("No se pudo guardar el paciente. (" + error.message + ")");
    }
});
