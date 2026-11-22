
/* =====================================
   ELEMENTOS HTML
===================================== */

const btnNuevoMedicamento = document.getElementById("btnNuevoMedicamento");

const modalMedicamento = document.getElementById("modalMedicamento");

const btnCerrarMedicamento = document.getElementById("btnCerrarMedicamento");

const btnCancelarMedicamento = document.getElementById("btnCancelarMedicamento");

const formMedicamento = document.getElementById("formMedicamento");

const tablaMedicamentos = document.getElementById("tablaMedicamentos");

const buscarMedicamento = document.getElementById("buscarMedicamento");

const totalMedicamentos = document.getElementById("totalMedicamentos");


// =====================================
// DATOS TEMPORALES
// =====================================

let medicamentos = JSON.parse(localStorage.getItem("medicamentos")) || [];


// =====================================
// ABRIR Y CERRAR MODAL
// =====================================

function abrirModal() {

    modalMedicamento.hidden = false;

}

function cerrarModal() {

    modalMedicamento.hidden = true;

    formMedicamento.reset();

}


// ABRIR

btnNuevoMedicamento.addEventListener("click", abrirModal);


// CERRAR

btnCerrarMedicamento.addEventListener("click", cerrarModal);

btnCancelarMedicamento.addEventListener("click", cerrarModal);


// =====================================
// REGISTRAR MEDICAMENTO
// =====================================

formMedicamento.addEventListener("submit", (e) => {

    e.preventDefault();


    // OBTENER LOS DATOS DEL FORMULARIO

    const medicamento = {

        id: Date.now(),

        nombreMedicamento: document
            .getElementById("nombreMedicamento")
            .value.trim(),

        mg: Number(document
            .getElementById("mgMedicamento")
            .value)

    };


    // VALIDAR MILIGRAMOS

    if (!Number.isInteger(medicamento.mg) || medicamento.mg <= 0) {

        alert("Ingresa una cantidad válida de miligramos.");

        return;

    }


    // AGREGAR MEDICAMENTO

    medicamentos.push(medicamento);


    // GUARDAR Y ACTUALIZAR

    guardarMedicamentos();

    mostrarMedicamentos();

    cerrarModal();

    alert("Medicamento registrado correctamente.");

});


// =====================================
// GUARDAR EN LOCALSTORAGE
// =====================================

function guardarMedicamentos() {

    localStorage.setItem(
        "medicamentos",
        JSON.stringify(medicamentos)
    );

}


// =====================================
// MOSTRAR MEDICAMENTOS
// =====================================

function mostrarMedicamentos(lista = medicamentos) {

    tablaMedicamentos.innerHTML = "";

    totalMedicamentos.textContent =
        `${lista.length} medicamentos`;


    lista.forEach((medicamento) => {

        const fila = document.createElement("tr");


        // COLUMNA ID

        const columnaId = document.createElement("td");

        columnaId.textContent = medicamento.id;


        // COLUMNA NOMBRE

        const columnaNombre = document.createElement("td");

        columnaNombre.textContent = medicamento.nombreMedicamento;


        // COLUMNA MG

        const columnaMg = document.createElement("td");

        columnaMg.textContent = `${medicamento.mg} mg`;


        // AGREGAR COLUMNAS A LA FILA

        fila.appendChild(columnaId);

        fila.appendChild(columnaNombre);

        fila.appendChild(columnaMg);


        // AGREGAR FILA A LA TABLA

        tablaMedicamentos.appendChild(fila);

    });

}


// =====================================
// BUSCAR MEDICAMENTOS
// =====================================

buscarMedicamento.addEventListener("input", () => {

    const texto = buscarMedicamento.value.toLowerCase();


    const resultados = medicamentos.filter((medicamento) => {

        return medicamento.nombreMedicamento
            .toLowerCase()
            .includes(texto);

    });


    mostrarMedicamentos(resultados);

});


// =====================================
// INICIALIZAR
// =====================================

mostrarMedicamentos();
