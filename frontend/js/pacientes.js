const API_URL = "http://localhost:8080/api/pacientes";

const btnNuevoPaciente = document.getElementById("btnNuevoPaciente");
const modalPaciente = document.getElementById("modalPaciente");
const btnCerrarModal = document.getElementById("btnCerrarModal");
const btnCancelar = document.getElementById("btnCancelar");
const formPaciente = document.getElementById("formPaciente");
const tablaPacientes = document.getElementById("tablaPacientes");
const buscarPaciente = document.getElementById("buscarPaciente");
const totalPacientes = document.getElementById("totalPacientes");
const tituloModal = document.getElementById("tituloModal");

let pacientes = [];
let idEditar = null;

function abrirModal() { modalPaciente.hidden = false; }

function cerrarModal() {
    modalPaciente.hidden = true;
    formPaciente.reset();
    idEditar = null;
    tituloModal.textContent = "Registrar paciente";
}

btnNuevoPaciente.addEventListener("click", () => {
    formPaciente.reset();
    idEditar = null;
    tituloModal.textContent = "Registrar paciente";
    abrirModal();
});
btnCerrarModal.addEventListener("click", cerrarModal);
btnCancelar.addEventListener("click", cerrarModal);

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

async function cargarPacientes() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error("Error " + respuesta.status);
        pacientes = await respuesta.json();
        mostrarPacientes();
    } catch (error) {
        console.error(error);
        alert("No se pudo cargar la lista de pacientes. Verifica que el backend esté encendido.");
    }
}

formPaciente.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const edad = calcularEdad(fechaNacimiento);

    if (edad < 0) {
        alert("La fecha de nacimiento no puede ser futura.");
        return;
    }

    const paciente = {
        dni: document.getElementById("dni").value.trim(),
        nombres: document.getElementById("nombres").value.trim(),
        apellidos: document.getElementById("apellidos").value.trim(),
        fechaNacimiento: fechaNacimiento,
        estadoCivil: document.getElementById("estadoCivil").value,
        edad: edad,
        telefono: document.getElementById("telefono").value.trim(),
        correo: document.getElementById("correo").value.trim()
    };

    const esEdicion = idEditar !== null;
    const url = esEdicion ? `${API_URL}/${idEditar}` : API_URL;

    try {
        const respuesta = await fetch(url, {
            method: esEdicion ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paciente)
        });

        if (!respuesta.ok) {
            throw new Error("Código " + respuesta.status);
        }

        alert(esEdicion ? "Paciente actualizado correctamente." : "Paciente registrado correctamente.");
        cerrarModal();
        cargarPacientes();

    } catch (error) {
        console.error(error);
        alert("No se pudo guardar el paciente. (" + error.message + ")");    }
});

function crearCelda(texto) {
    const td = document.createElement("td");
    td.textContent = texto;
    return td;
}

function mostrarPacientes(lista = pacientes) {
    tablaPacientes.innerHTML = "";
    totalPacientes.textContent = `${lista.length} pacientes`;

    lista.forEach((paciente) => {
        const fila = document.createElement("tr");

        fila.appendChild(crearCelda(paciente.dni));
        fila.appendChild(crearCelda(paciente.nombres));
        fila.appendChild(crearCelda(paciente.apellidos));
        fila.appendChild(crearCelda(paciente.telefono || "No registrado"));
        fila.appendChild(crearCelda(paciente.correo || "No registrado"));

        const tdAcciones = document.createElement("td");
        const divAcciones = document.createElement("div");
        divAcciones.className = "acciones";

        const btnEditar = document.createElement("button");
        btnEditar.className = "btn-editar";
        btnEditar.textContent = "Editar";
        btnEditar.addEventListener("click", () => editarPaciente(paciente));

        const btnEliminar = document.createElement("button");
        btnEliminar.className = "btn-eliminar";
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", () => eliminarPaciente(paciente.id));

        divAcciones.appendChild(btnEditar);
        divAcciones.appendChild(btnEliminar);
        tdAcciones.appendChild(divAcciones);
        fila.appendChild(tdAcciones);

        tablaPacientes.appendChild(fila);
    });
}

function editarPaciente(paciente) {
    document.getElementById("dni").value = paciente.dni;
    document.getElementById("nombres").value = paciente.nombres;
    document.getElementById("apellidos").value = paciente.apellidos;
    document.getElementById("fechaNacimiento").value = paciente.fechaNacimiento;
    document.getElementById("estadoCivil").value = paciente.estadoCivil;
    document.getElementById("telefono").value = paciente.telefono || "";
    document.getElementById("correo").value = paciente.correo || "";

    idEditar = paciente.id;
    tituloModal.textContent = "Editar paciente";
    abrirModal();
}

async function eliminarPaciente(id) {
    if (!confirm("¿Deseas eliminar este paciente?")) return;

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!respuesta.ok) throw new Error("Código " + respuesta.status);
        cargarPacientes();
    } catch (error) {
        console.error(error);
        alert("No se pudo eliminar. Puede tener citas o documentos asociados.");
    }
}

buscarPaciente.addEventListener("input", () => {
    const texto = buscarPaciente.value.toLowerCase();

    const resultados = pacientes.filter((p) =>
        p.nombres.toLowerCase().includes(texto) ||
        p.apellidos.toLowerCase().includes(texto) ||
        p.dni.includes(texto)
    );

    mostrarPacientes(resultados);
});

cargarPacientes();