const API_URL = "http://localhost:8080/api/medicamentos";

const btnNuevoMedicamento = document.getElementById("btnNuevoMedicamento");
const modalMedicamento = document.getElementById("modalMedicamento");
const btnCerrarMedicamento = document.getElementById("btnCerrarMedicamento");
const btnCancelarMedicamento = document.getElementById("btnCancelarMedicamento");

const formMedicamento = document.getElementById("formMedicamento");
const tablaMedicamentos = document.getElementById("tablaMedicamentos");
const buscarMedicamento = document.getElementById("buscarMedicamento");
const totalMedicamentos = document.getElementById("totalMedicamentos");

let medicamentos = [];

function abrirModal() {
    modalMedicamento.hidden = false;
}

function cerrarModal() {
    modalMedicamento.hidden = true;
    formMedicamento.reset();
}

btnNuevoMedicamento.addEventListener("click", abrirModal);
btnCerrarMedicamento.addEventListener("click", cerrarModal);
btnCancelarMedicamento.addEventListener("click", cerrarModal);

async function cargarMedicamentos() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error("Código " + respuesta.status);
        medicamentos = await respuesta.json();
        mostrarMedicamentos();
    } catch (error) {
        console.error(error);
        alert("No se pudo cargar la lista de medicamentos. Verifica que el backend esté encendido.");
    }
}

formMedicamento.addEventListener("submit", async (e) => {
    e.preventDefault();

    const medicamento = {
        nombreMedicamento: document.getElementById("nombreMedicamento").value.trim(),
        mg: Number(document.getElementById("mgMedicamento").value),
        cantidad: Number(document.getElementById("cantidadMedicamento").value)
    };

    if (!Number.isInteger(medicamento.mg) || medicamento.mg <= 0) {
        alert("Ingresa una cantidad válida de miligramos.");
        return;
    }

    if (!Number.isInteger(medicamento.cantidad) || medicamento.cantidad < 0) {
        alert("Ingresa una cantidad disponible válida (0 o más).");
        return;
    }

    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(medicamento)
        });

        if (!respuesta.ok) throw new Error("Código " + respuesta.status);

        alert("Medicamento registrado correctamente.");
        cerrarModal();
        cargarMedicamentos();

    } catch (error) {
        console.error(error);
        alert("No se pudo guardar el medicamento. (" + error.message + ")");
    }
});

function crearCelda(texto) {
    const td = document.createElement("td");
    td.textContent = texto;
    return td;
}

function mostrarMedicamentos(lista = medicamentos) {
    tablaMedicamentos.innerHTML = "";
    totalMedicamentos.textContent = `${lista.length} medicamentos`;

    lista.forEach((medicamento) => {
        const fila = document.createElement("tr");

        fila.appendChild(crearCelda(medicamento.id));
        fila.appendChild(crearCelda(medicamento.nombreMedicamento));
        fila.appendChild(crearCelda(`${medicamento.mg} mg`));
        fila.appendChild(crearCelda(medicamento.cantidad));

        tablaMedicamentos.appendChild(fila);
    });
}

buscarMedicamento.addEventListener("input", () => {
    const texto = buscarMedicamento.value.toLowerCase();

    const resultados = medicamentos.filter((medicamento) =>
        medicamento.nombreMedicamento.toLowerCase().includes(texto)
    );

    mostrarMedicamentos(resultados);
});

cargarMedicamentos();