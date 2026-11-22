
// =====================================
// ELEMENTOS HTML
// =====================================

const btnNuevoPaciente = document.getElementById("btnNuevoPaciente");

const modalPaciente = document.getElementById("modalPaciente");

const btnCerrarModal = document.getElementById("btnCerrarModal");

const btnCancelar = document.getElementById("btnCancelar");

const formPaciente = document.getElementById("formPaciente");

const tablaPacientes = document.getElementById("tablaPacientes");

const buscarPaciente = document.getElementById("buscarPaciente");

const totalPacientes = document.getElementById("totalPacientes");

const tituloModal = document.getElementById("tituloModal");


// =====================================
// DATOS TEMPORALES
// =====================================

let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

let indiceEditar = null;


// =====================================
// ABRIR Y CERRAR MODAL
// =====================================

function abrirModal() {

    modalPaciente.hidden = false;

}

function cerrarModal() {

    modalPaciente.hidden = true;

    formPaciente.reset();

    indiceEditar = null;

    tituloModal.textContent = "Registrar paciente";

}


// =====================================
// BOTON NUEVO PACIENTE
// =====================================

btnNuevoPaciente.addEventListener("click", () => {

    formPaciente.reset();

    indiceEditar = null;

    tituloModal.textContent = "Registrar paciente";

    abrirModal();

});


// CERRAR MODAL

btnCerrarModal.addEventListener("click", cerrarModal);

btnCancelar.addEventListener("click", cerrarModal);


// =====================================
// GUARDAR PACIENTES
// =====================================

formPaciente.addEventListener("submit", (e) => {

    e.preventDefault();

    const paciente = {

        dni: document.getElementById("dni").value.trim(),

        nombres: document.getElementById("nombres").value.trim(),

        apellidos: document.getElementById("apellidos").value.trim(),

        telefono: document.getElementById("telefono").value.trim(),

        correo: document.getElementById("correo").value.trim()

    };


    // VALIDAR DNI REPETIDO

    const dniExiste = pacientes.some((p, index) => {

        return p.dni === paciente.dni && index !== indiceEditar;

    });

    if (dniExiste) {

        alert("Ya existe un paciente con ese DNI.");

        return;

    }


    // REGISTRAR O EDITAR

    if (indiceEditar === null) {

        pacientes.push(paciente);

        alert("Paciente registrado correctamente.");

    } else {

        pacientes[indiceEditar] = paciente;

        alert("Paciente actualizado correctamente.");

    }


    guardarDatos();

    mostrarPacientes();

    cerrarModal();

});


// =====================================
// GUARDAR EN LOCALSTORAGE
// =====================================

function guardarDatos() {

    localStorage.setItem("pacientes", JSON.stringify(pacientes));

}


// =====================================
// MOSTRAR PACIENTES
// =====================================

function mostrarPacientes(lista = pacientes) {

    tablaPacientes.innerHTML = "";

    totalPacientes.textContent = `${lista.length} pacientes`;


    lista.forEach((paciente) => {

        const fila = document.createElement("tr");

        fila.innerHTML = `

            <td>${paciente.dni}</td>

            <td>${paciente.nombres}</td>

            <td>${paciente.apellidos}</td>

            <td>${paciente.telefono}</td>

            <td>${paciente.correo || "No registrado"}</td>

            <td>

                <div class="acciones">

                    <button class="btn-editar">
                        Editar
                    </button>

                    <button class="btn-eliminar">
                        Eliminar
                    </button>

                </div>

            </td>

        `;


        // BOTON EDITAR

        fila.querySelector(".btn-editar").addEventListener("click", () => {

            editarPaciente(pacientes.indexOf(paciente));

        });


        // BOTON ELIMINAR

        fila.querySelector(".btn-eliminar").addEventListener("click", () => {

            eliminarPaciente(pacientes.indexOf(paciente));

        });


        tablaPacientes.appendChild(fila);

    });

}


// =====================================
// EDITAR PACIENTE
// =====================================

function editarPaciente(index) {

    const paciente = pacientes[index];

    document.getElementById("dni").value = paciente.dni;

    document.getElementById("nombres").value = paciente.nombres;

    document.getElementById("apellidos").value = paciente.apellidos;

    document.getElementById("telefono").value = paciente.telefono;

    document.getElementById("correo").value = paciente.correo;


    indiceEditar = index;

    tituloModal.textContent = "Editar paciente";

    abrirModal();

}


// =====================================
// ELIMINAR PACIENTE
// =====================================

function eliminarPaciente(index) {

    const confirmar = confirm("¿Deseas eliminar este paciente?");

    if (confirmar) {

        pacientes.splice(index, 1);

        guardarDatos();

        mostrarPacientes();

    }

}


// =====================================
// BUSCAR PACIENTES
// =====================================

buscarPaciente.addEventListener("input", () => {

    const texto = buscarPaciente.value.toLowerCase();

    const resultados = pacientes.filter((paciente) => {

        return (

            paciente.nombres.toLowerCase().includes(texto) ||

            paciente.apellidos.toLowerCase().includes(texto) ||

            paciente.dni.includes(texto)

        );

    });

    mostrarPacientes(resultados);

});


// =====================================
// INICIALIZAR
// =====================================

mostrarPacientes();
