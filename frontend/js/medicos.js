
// =====================================
// ELEMENTOS HTML
// =====================================

const btnNuevoMedico = document.getElementById("btnNuevoMedico");
const modalMedico = document.getElementById("modalMedico");
const btnCerrarMedico = document.getElementById("btnCerrarMedico");
const btnCancelarMedico = document.getElementById("btnCancelarMedico");

const formMedico = document.getElementById("formMedico");
const tablaMedicos = document.getElementById("tablaMedicos");
const buscarMedico = document.getElementById("buscarMedico");
const totalMedicos = document.getElementById("totalMedicos");


// =====================================
// ALMACENAMIENTO TEMPORAL
// =====================================

let medicos = JSON.parse(localStorage.getItem("medicos")) || [];


// =====================================
// ABRIR Y CERRAR MODAL
// =====================================

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


// =====================================
// GUARDAR MEDICO
// =====================================

formMedico.addEventListener("submit", (e) => {

    e.preventDefault();

    const medico = {

        nombre: document.getElementById("nombreMedico").value.trim(),

        apellido: document.getElementById("apellidoMedico").value.trim(),

        especialidad: document.getElementById("especialidadMedico").value.trim(),

        colegioMedico: document.getElementById("colegioMedico").value.trim()

    };


    // AGREGAR MEDICO

    medicos.push(medico);

    guardarMedicos();

    mostrarMedicos();

    cerrarModal();

    alert("Médico registrado correctamente.");

});


// =====================================
// GUARDAR EN LOCALSTORAGE
// =====================================

function guardarMedicos() {

    localStorage.setItem("medicos", JSON.stringify(medicos));

}


// =====================================
// MOSTRAR MEDICOS
// =====================================

function mostrarMedicos(lista = medicos) {

    tablaMedicos.innerHTML = "";

    totalMedicos.textContent = `${lista.length} médicos`;


    lista.forEach((medico, index) => {

        const fila = document.createElement("tr");

        fila.innerHTML = `

            <td>${index + 1}</td>

            <td>${medico.nombre}</td>

            <td>${medico.apellido}</td>

            <td>${medico.especialidad}</td>

            <td>${medico.colegioMedico}</td>

        `;

        tablaMedicos.appendChild(fila);

    });

}


// =====================================
// BUSCAR MEDICOS
// =====================================

buscarMedico.addEventListener("input", () => {

    const texto = buscarMedico.value.toLowerCase();

    const resultados = medicos.filter((medico) => {

        return (

            medico.nombre.toLowerCase().includes(texto) ||

            medico.apellido.toLowerCase().includes(texto) ||

            medico.especialidad.toLowerCase().includes(texto)

        );

    });

    mostrarMedicos(resultados);

});


// =====================================
// INICIALIZAR
// =====================================

mostrarMedicos();
