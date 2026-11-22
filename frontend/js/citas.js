
// =====================================
// ELEMENTOS HTML
// =====================================

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


// =====================================
// DATOS TEMPORALES
// =====================================

let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

let medicos = JSON.parse(localStorage.getItem("medicos")) || [];

let citas = JSON.parse(localStorage.getItem("citas")) || [];


// =====================================
// ABRIR Y CERRAR MODAL
// =====================================

function abrirModal() {

    modalCita.hidden = false;

}

function cerrarModal() {

    modalCita.hidden = true;

    formCita.reset();

}

btnNuevaCita.addEventListener("click", () => {

    cargarPacientes();

    cargarMedicos();

    abrirModal();

});

btnCerrarCita.addEventListener("click", cerrarModal);

btnCancelarCita.addEventListener("click", cerrarModal);


// =====================================
// CARGAR PACIENTES EN SELECT
// =====================================

function cargarPacientes() {

    pacienteCita.innerHTML = `
        <option value="">Seleccionar paciente</option>
    `;

    pacientes.forEach((paciente) => {

        const opcion = document.createElement("option");

        opcion.value = paciente.dni;

        opcion.textContent =
            `${paciente.nombres} ${paciente.apellidos} - DNI: ${paciente.dni}`;

        pacienteCita.appendChild(opcion);

    });

}


// =====================================
// CARGAR MEDICOS EN SELECT
// =====================================

function cargarMedicos() {

    medicoCita.innerHTML = `
        <option value="">Seleccionar médico</option>
    `;

    medicos.forEach((medico, index) => {

        const opcion = document.createElement("option");

        opcion.value = index;

        opcion.textContent =
            `Dr. ${medico.nombre} ${medico.apellido} - ${medico.especialidad}`;

        medicoCita.appendChild(opcion);

    });

}


// =====================================
// GUARDAR CITA
// =====================================

formCita.addEventListener("submit", (e) => {

    e.preventDefault();

    const pacienteSeleccionado = pacientes.find((p) => {

        return p.dni === pacienteCita.value;

    });

    const medicoSeleccionado = medicos[Number(medicoCita.value)];

    if (!pacienteSeleccionado || !medicoSeleccionado) {

        alert("Debes seleccionar un paciente y un médico.");

        return;

    }


    const cita = {

        id: Date.now(),

        paciente: {
            dni: pacienteSeleccionado.dni,
            nombres: pacienteSeleccionado.nombres,
            apellidos: pacienteSeleccionado.apellidos
        },

        medico: {
            nombre: medicoSeleccionado.nombre,
            apellido: medicoSeleccionado.apellido,
            especialidad: medicoSeleccionado.especialidad
        },

        fecha: fechaCita.value,

        estado: estadoCita.value

    };


    citas.push(cita);

    guardarCitas();

    mostrarCitas();

    cerrarModal();

    alert("Cita registrada correctamente.");

});


// =====================================
// GUARDAR EN LOCALSTORAGE
// =====================================

function guardarCitas() {

    localStorage.setItem("citas", JSON.stringify(citas));

}


// =====================================
// MOSTRAR CITAS
// =====================================

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

        let claseEstado = "pendiente";

        if (cita.estado === "Atendida") {
            claseEstado = "atendida";
        }

        if (cita.estado === "Cancelada") {
            claseEstado = "cancelada";
        }


        fila.innerHTML = `

            <td>${cita.id}</td>

            <td>
                ${cita.paciente.nombres}
                ${cita.paciente.apellidos}
            </td>

            <td>
                ${cita.medico.nombre}
                ${cita.medico.apellido}
            </td>

            <td>${fechaFormateada}</td>

            <td>${horaFormateada}</td>

            <td>
                <span class="estado ${claseEstado}">
                    ${cita.estado}
                </span>
            </td>

        `;

        tablaCitas.appendChild(fila);

    });

}


// =====================================
// BUSCAR CITAS
// =====================================

buscarCita.addEventListener("input", () => {

    const texto = buscarCita.value.toLowerCase();

    const resultados = citas.filter((cita) => {

        const nombrePaciente =
            `${cita.paciente.nombres} ${cita.paciente.apellidos}`;

        const nombreMedico =
            `${cita.medico.nombre} ${cita.medico.apellido}`;

        return (

            nombrePaciente.toLowerCase().includes(texto) ||

            nombreMedico.toLowerCase().includes(texto)

        );

    });

    mostrarCitas(resultados);

});


// =====================================
// INICIALIZAR
// =====================================

mostrarCitas();
