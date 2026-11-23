const API_URL = "http://localhost:8080/api/medicos";

const btnNuevoMedico = document.getElementById("btnNuevoMedico");
const modalMedico = document.getElementById("modalMedico");
const btnCerrarMedico = document.getElementById("btnCerrarMedico");
const btnCancelarMedico = document.getElementById("btnCancelarMedico");

const formMedico = document.getElementById("formMedico");
const tablaMedicos = document.getElementById("tablaMedicos");
const buscarMedico = document.getElementById("buscarMedico");
const totalMedicos = document.getElementById("totalMedicos");

let medicos = [];

function abrirModal() {
    modalMedico.hidden = false;
}

function cerrarModal() {
    modalMedico.hidden = true;
    formMedico.reset();
}

btnNuevoMedico.addEventListener("click", abrirModal);
btnCerrarMedico.addEventListener("click", cerrarModal);
btnCancelarMedico.addEventListener("click", cerrarModal);

async function cargarMedicos() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error("Código " + respuesta.status);
        medicos = await respuesta.json();
        mostrarMedicos();
    } catch (error) {
        console.error(error);
        alert("No se pudo cargar la lista de médicos. Verifica que el backend esté encendido.");
    }
}

formMedico.addEventListener("submit", async (e) => {
    e.preventDefault();

    const medico = {
        nombre: document.getElementById("nombreMedico").value.trim(),
        apellido: document.getElementById("apellidoMedico").value.trim(),
        especialidad: document.getElementById("especialidadMedico").value.trim(),
        colegioMedico: document.getElementById("colegioMedico").value.trim()
    };

    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(medico)
        });

        if (!respuesta.ok) throw new Error("Código " + respuesta.status);

        alert("Médico registrado correctamente.");
        cerrarModal();
        cargarMedicos();

    } catch (error) {
        console.error(error);
        alert("No se pudo guardar el médico. (" + error.message + ")");
    }
});

function crearCelda(texto) {
    const td = document.createElement("td");
    td.textContent = texto;
    return td;
}

function mostrarMedicos(lista = medicos) {
    tablaMedicos.innerHTML = "";
    totalMedicos.textContent = `${lista.length} médicos`;

    lista.forEach((medico) => {
        const fila = document.createElement("tr");

        fila.appendChild(crearCelda(medico.id));
        fila.appendChild(crearCelda(medico.nombre));
        fila.appendChild(crearCelda(medico.apellido));
        fila.appendChild(crearCelda(medico.especialidad));
        fila.appendChild(crearCelda(medico.colegioMedico));

        tablaMedicos.appendChild(fila);
    });
}

buscarMedico.addEventListener("input", () => {
    const texto = buscarMedico.value.toLowerCase();

    const resultados = medicos.filter((medico) =>
        medico.nombre.toLowerCase().includes(texto) ||
        medico.apellido.toLowerCase().includes(texto) ||
        medico.especialidad.toLowerCase().includes(texto)
    );

    mostrarMedicos(resultados);
});

cargarMedicos();
