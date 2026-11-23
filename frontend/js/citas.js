const API_CITAS = "http://localhost:8080/api/agendar-cita";
const API_PACIENTES = "http://localhost:8080/api/pacientes";
const API_MEDICOS = "http://localhost:8080/api/medicos";

const btnNuevaCita = document.getElementById("btnNuevaCita");
const modalCita = document.getElementById("modalCita");
const btnCerrarCita = document.getElementById("btnCerrarCita");
const btnCancelarCita = document.getElementById("btnCancelarCita");

const formCita = document.getElementById("formCita");

const pacienteCita = document.getElementById("pacienteCita");
const medicoCita = document.getElementById("medicoCita");
const fechaCita = document.getElementById("fechaCita");
const estadoCita = document.getElementById("estadoCita");

const tablaCitas = document.getElementById("tablaCitas");
const buscarCita = document.getElementById("buscarCita");
const totalCitas = document.getElementById("totalCitas");


let citas = [];

function obtenerTokenAdmin() {
    return sessionStorage.getItem("token") || "";
}



function abrirModal() {
    modalCita.hidden = false;
}

function cerrarModal() {
    modalCita.hidden = true;
    formCita.reset();
}

btnNuevaCita.addEventListener("click", async () => {
    const hayDatos = await cargarSelects();

    if (!hayDatos) {
        alert("Primero debes registrar al menos un paciente y un médico.");
        return;
    }

    abrirModal();
});

btnCerrarCita.addEventListener("click", cerrarModal);
btnCancelarCita.addEventListener("click", cerrarModal);



async function cargarSelects() {
    try {
        const [resPacientes, resMedicos] = await Promise.all([
            fetch(API_PACIENTES),
            fetch(API_MEDICOS)
        ]);

        if (!resPacientes.ok || !resMedicos.ok) {
            throw new Error("No se pudieron leer pacientes o médicos");
        }

        const pacientes = await resPacientes.json();
        const medicos = await resMedicos.json();

        pacienteCita.innerHTML = '<option value="">Seleccionar paciente</option>';

        pacientes.forEach((paciente) => {
            const opcion = document.createElement("option");
            opcion.value = paciente.id;
            opcion.textContent =
                `${paciente.nombres} ${paciente.apellidos} - DNI: ${paciente.dni}`;
            pacienteCita.appendChild(opcion);
        });

        medicoCita.innerHTML = '<option value="">Seleccionar médico</option>';

        medicos.forEach((medico) => {
            const opcion = document.createElement("option");
            opcion.value = medico.id;
            opcion.textContent =
                `Dr. ${medico.nombre} ${medico.apellido} - ${medico.especialidad}`;
            medicoCita.appendChild(opcion);
        });

        return pacientes.length > 0 && medicos.length > 0;
    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar los pacientes y médicos. Verifica que el backend esté encendido.");
        return false;
    }
}


async function cargarCitas() {
    try {
        const respuesta = await fetch(API_CITAS, {
            headers: {
                "Authorization": obtenerTokenAdmin()
            }
        });
        if (!respuesta.ok) throw new Error("Código " + respuesta.status);
        citas = await respuesta.json();
        mostrarCitas();
    } catch (error) {
        console.error(error);
        alert("No se pudo cargar la lista de citas. Verifica que el backend esté encendido.");
    }
}



formCita.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!pacienteCita.value || !medicoCita.value) {
        alert("Debes seleccionar un paciente y un médico.");
        return;
    }

    const cita = {
        fecha: fechaCita.value,
        estado: estadoCita.value,
        paciente: { id: Number(pacienteCita.value) },
        medico: { id: Number(medicoCita.value) }
    };

    try {
        const respuesta = await fetch(API_CITAS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": obtenerTokenAdmin()
            },
            body: JSON.stringify(cita)
        });

        if (!respuesta.ok) throw new Error("Código " + respuesta.status);

        alert("Cita registrada correctamente.");
        cerrarModal();
        cargarCitas();
    } catch (error) {
        console.error(error);
        alert("No se pudo guardar la cita. (" + error.message + ")");
    }
});



async function marcarCitaAtendida(cita) {
    const payloadActualizado = {
        ...cita,
        estado: "Atendida",
        paciente: cita.paciente ? { id: cita.paciente.id } : undefined,
        medico: cita.medico ? { id: cita.medico.id } : undefined
    };

    try {
        let respuesta = await fetch(`${API_CITAS}/${cita.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": obtenerTokenAdmin()
            },
            body: JSON.stringify(payloadActualizado)
        });

        if (respuesta.status === 404 || respuesta.status === 405) {
            respuesta = await fetch(`${API_CITAS}/${cita.id}/estado`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": obtenerTokenAdmin()
                },
                body: JSON.stringify({ estado: "Atendida" })
            });
        }

        if (!respuesta.ok) {
            throw new Error("Código " + respuesta.status);
        }

        alert("Cita actualizada a estado: Atendida.");
        await cargarCitas();
    } catch (error) {
        console.error(error);
        alert("No se pudo actualizar el estado de la cita (" + error.message + ").");
    }
}


function crearCelda(texto) {
    const td = document.createElement("td");
    td.textContent = texto;
    return td;
}

function mostrarCitas(lista = citas) {
    tablaCitas.innerHTML = "";
    totalCitas.textContent = `${lista.length} citas`;

    lista.forEach((cita) => {
        const fila = document.createElement("tr");

        const fecha = new Date(cita.fecha);

        const fechaFormateada = fecha.toLocaleDateString("es-PE");

        const horaFormateada = fecha.toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit"
        });

        const estadoLower = (cita.estado || "Pendiente").toLowerCase();
        let claseEstado = "pendiente";

        if (estadoLower.includes("atendid")) {
            claseEstado = "atendida";
        } else if (estadoLower.includes("cancel")) {
            claseEstado = "cancelada";
        }

        const paciente = cita.paciente
            ? `${cita.paciente.nombres} ${cita.paciente.apellidos}`
            : (cita.username || "—");

        const medico = cita.medico
            ? `${cita.medico.nombre} ${cita.medico.apellido}`
            : "—";

        fila.appendChild(crearCelda(cita.id));
        fila.appendChild(crearCelda(paciente));
        fila.appendChild(crearCelda(medico));
        fila.appendChild(crearCelda(fechaFormateada));
        fila.appendChild(crearCelda(horaFormateada));

        const tdEstado = document.createElement("td");
        const spanEstado = document.createElement("span");
        spanEstado.className = `estado ${claseEstado}`;
        spanEstado.textContent = cita.estado || "Pendiente";
        tdEstado.appendChild(spanEstado);
        fila.appendChild(tdEstado);

        const tdAccion = document.createElement("td");
        if (!estadoLower.includes("atendid")) {
            const btnAtender = document.createElement("button");
            btnAtender.type = "button";
            btnAtender.className = "btn-editar";
            btnAtender.textContent = "Marcar atendida";
            btnAtender.addEventListener("click", () => marcarCitaAtendida(cita));
            tdAccion.appendChild(btnAtender);
        } else {
            tdAccion.textContent = "—";
        }
        fila.appendChild(tdAccion);

        tablaCitas.appendChild(fila);
    });
}


buscarCita.addEventListener("input", () => {
    const texto = buscarCita.value.toLowerCase();

    const resultados = citas.filter((cita) => {
        const nombrePaciente = cita.paciente
            ? `${cita.paciente.nombres} ${cita.paciente.apellidos}`
            : (cita.username || "");

        const nombreMedico = cita.medico
            ? `${cita.medico.nombre} ${cita.medico.apellido}`
            : "";

        return (
            nombrePaciente.toLowerCase().includes(texto) ||
            nombreMedico.toLowerCase().includes(texto)
        );
    });

    mostrarCitas(resultados);
});


cargarCitas();