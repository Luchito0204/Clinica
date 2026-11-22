
/* =====================================
   DATOS TEMPORALES
===================================== */

let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

let medicos = JSON.parse(localStorage.getItem("medicos")) || [];

let medicamentos = JSON.parse(localStorage.getItem("medicamentos")) || [];

let recetas = JSON.parse(localStorage.getItem("recetas")) || [];

let certificados = JSON.parse(localStorage.getItem("certificados")) || [];

let historiales = JSON.parse(localStorage.getItem("historiales")) || [];


// =====================================
// ELEMENTOS HTML
// =====================================

const pestañas = document.querySelectorAll(".tab-documento");


// =====================================
// CAMBIAR ENTRE PESTAÑAS
// =====================================

pestañas.forEach((pestaña) => {

    pestaña.addEventListener("click", () => {

        const tipo = pestaña.dataset.tipo;

        pestañas.forEach((p) => p.classList.remove("activo"));

        document.querySelectorAll(".documento-seccion")
            .forEach((seccion) => seccion.classList.remove("activa"));

        pestaña.classList.add("activo");

        document.getElementById(`seccion-${tipo}`)
            .classList.add("activa");

    });

});


// =====================================
// FUNCIONES GENERALES
// =====================================

function abrirModal(id) {

    document.getElementById(id).hidden = false;

}

function cerrarModal(id) {

    document.getElementById(id).hidden = true;

    const formulario = document.querySelector(`#${id} form`);

    if (formulario) formulario.reset();

}


// CERRAR MODALES

document.querySelectorAll("[data-cerrar]").forEach((boton) => {

    boton.addEventListener("click", () => {

        cerrarModal(boton.dataset.cerrar);

    });

});


// =====================================
// CARGAR OPCIONES EN SELECT
// =====================================

function cargarOpciones(id, lista, obtenerTexto, obtenerValor) {

    const select = document.getElementById(id);

    select.innerHTML = "";

    const opcionInicial = document.createElement("option");

    opcionInicial.value = "";

    opcionInicial.textContent = "Seleccionar opción";

    select.appendChild(opcionInicial);


    lista.forEach((elemento, index) => {

        const opcion = document.createElement("option");

        opcion.value = obtenerValor(elemento, index);

        opcion.textContent = obtenerTexto(elemento);

        select.appendChild(opcion);

    });

}


// CARGAR PACIENTES

function cargarPacientes(id) {

    cargarOpciones(
        id,
        pacientes,
        p => `${p.nombres} ${p.apellidos} - DNI: ${p.dni}`,
        p => p.dni
    );

}


// CARGAR MEDICOS

function cargarMedicos(id) {

    cargarOpciones(
        id,
        medicos,
        m => `${m.nombre} ${m.apellido} - ${m.especialidad}`,
        (m, index) => index
    );

}


// CARGAR MEDICAMENTOS

function cargarMedicamentos() {

    cargarOpciones(
        "medicamentoReceta",
        medicamentos,
        m => `${m.nombreMedicamento} - ${m.mg} mg`,
        (m, index) => index
    );

}


// =====================================
// BUSCAR PACIENTE POR DNI
// =====================================

function buscarPacientePorDni(dni) {

    return pacientes.find(p => p.dni === dni);

}


// =====================================
// OBTENER NOMBRE DEL MEDICO
// =====================================

function obtenerNombreMedico(index) {

    const medico = medicos[Number(index)];

    return medico
        ? `${medico.nombre} ${medico.apellido}`
        : "No disponible";

}


// =====================================
// PREPARAR FORMULARIOS
// =====================================

function prepararFormulario(ids) {

    cargarPacientes(ids.paciente);

    cargarMedicos(ids.medico);

}


// =====================================
// ABRIR FORMULARIO RECETA
// =====================================

document.getElementById("btnNuevaReceta").addEventListener("click", () => {

    prepararFormulario({
        paciente: "pacienteReceta",
        medico: "medicoReceta"
    });

    cargarMedicamentos();

    abrirModal("modalReceta");

});


// =====================================
// REGISTRAR RECETA
// =====================================

document.getElementById("formReceta").addEventListener("submit", (e) => {

    e.preventDefault();

    const paciente = buscarPacientePorDni(
        document.getElementById("pacienteReceta").value
    );

    const indiceMedico = document.getElementById("medicoReceta").value;

    const medico = medicos[Number(indiceMedico)];

    const medicamento = medicamentos[
        Number(document.getElementById("medicamentoReceta").value)
    ];

    if (!paciente || !medico || !medicamento) {

        alert("Debes seleccionar todos los datos.");

        return;

    }

    const receta = {

        id: Date.now(),

        paciente: `${paciente.nombres} ${paciente.apellidos}`,

        medico: `${medico.nombre} ${medico.apellido}`,

        medicamento: medicamento.nombreMedicamento,

        indicaciones: document.getElementById("indicacionesReceta").value.trim()

    };


    recetas.push(receta);

    localStorage.setItem("recetas", JSON.stringify(recetas));

    mostrarRecetas();

    cerrarModal("modalReceta");

    alert("Receta registrada correctamente.");

});


// =====================================
// ABRIR FORMULARIO CERTIFICADO
// =====================================

document.getElementById("btnNuevoCertificado").addEventListener("click", () => {

    prepararFormulario({
        paciente: "pacienteCertificado",
        medico: "medicoCertificado"
    });

    abrirModal("modalCertificado");

});


// =====================================
// REGISTRAR CERTIFICADO
// =====================================

document.getElementById("formCertificado").addEventListener("submit", (e) => {

    e.preventDefault();

    const paciente = buscarPacientePorDni(
        document.getElementById("pacienteCertificado").value
    );

    const indiceMedico = document.getElementById("medicoCertificado").value;

    const medico = medicos[Number(indiceMedico)];

    if (!paciente || !medico) {

        alert("Debes seleccionar un paciente y un médico.");

        return;

    }


    const certificado = {

        id: Date.now(),

        paciente: `${paciente.nombres} ${paciente.apellidos}`,

        medico: `${medico.nombre} ${medico.apellido}`,

        pacienteDni: paciente.dni,

        medicoIndice: Number(indiceMedico),

        fechaEmision: document.getElementById("fechaEmision").value,

        diagnostico: document.getElementById("diagnostico").value.trim()

    };


    certificados.push(certificado);

    localStorage.setItem("certificados", JSON.stringify(certificados));

    mostrarCertificados();

    cerrarModal("modalCertificado");

    alert("Certificado registrado correctamente.");

});


// =====================================
// CARGAR CERTIFICADOS PARA HISTORIAL
// =====================================

function cargarCertificados() {

    cargarOpciones(
        "certificadoHistorial",
        certificados,
        c => `Certificado ${c.id} - ${c.paciente}`,
        (c, index) => index
    );

}


// =====================================
// ABRIR FORMULARIO HISTORIAL
// =====================================

document.getElementById("btnNuevoHistorial").addEventListener("click", () => {

    prepararFormulario({
        paciente: "pacienteHistorial",
        medico: "medicoHistorial"
    });

    cargarCertificados();

    abrirModal("modalHistorial");

});


// =====================================
// REGISTRAR HISTORIAL
// =====================================

document.getElementById("formHistorial").addEventListener("submit", (e) => {

    e.preventDefault();

    const paciente = buscarPacientePorDni(
        document.getElementById("pacienteHistorial").value
    );

    const indiceMedico = document.getElementById("medicoHistorial").value;

    const medico = medicos[Number(indiceMedico)];

    const certificado = certificados[
        Number(document.getElementById("certificadoHistorial").value)
    ];

    if (!paciente || !medico || !certificado) {

        alert("Debes seleccionar todos los datos.");

        return;

    }

    // COMPROBAR QUE LOS DOCUMENTOS PERTENEZCAN
    // AL MISMO PACIENTE Y MEDICO

    if (
        certificado.pacienteDni !== paciente.dni ||
        certificado.medicoIndice !== Number(indiceMedico)
    ) {

        alert("El certificado debe pertenecer al paciente y médico seleccionados.");

        return;

    }


    const historial = {

        id: Date.now(),

        paciente: `${paciente.nombres} ${paciente.apellidos}`,

        medico: `${medico.nombre} ${medico.apellido}`,

        fechaConsulta: document.getElementById("fechaConsulta").value,

        certificadoId: certificado.id

    };


    historiales.push(historial);

    localStorage.setItem("historiales", JSON.stringify(historiales));

    mostrarHistoriales();

    cerrarModal("modalHistorial");

    alert("Historial médico registrado correctamente.");

});


// =====================================
// FUNCION PARA AGREGAR CELDAS SEGURAS
// =====================================

function agregarFila(tabla, valores) {

    const fila = document.createElement("tr");

    valores.forEach((valor) => {

        const celda = document.createElement("td");

        celda.textContent = valor;

        fila.appendChild(celda);

    });

    tabla.appendChild(fila);

}


// =====================================
// MOSTRAR RECETAS
// =====================================

function mostrarRecetas() {

    const tabla = document.getElementById("tablaRecetas");

    tabla.innerHTML = "";

    document.getElementById("totalRecetas").textContent =
        `${recetas.length} recetas`;

    recetas.forEach((r) => {

        agregarFila(tabla, [
            r.paciente,
            r.medico,
            r.medicamento,
            r.indicaciones
        ]);

    });

}


// =====================================
// MOSTRAR CERTIFICADOS
// =====================================

function mostrarCertificados() {

    const tabla = document.getElementById("tablaCertificados");

    tabla.innerHTML = "";

    document.getElementById("totalCertificados").textContent =
        `${certificados.length} certificados`;

    certificados.forEach((c) => {

        const fecha = new Date(c.fechaEmision);

        agregarFila(tabla, [
            c.paciente,
            c.medico,
            fecha.toLocaleString("es-PE"),
            c.diagnostico
        ]);

    });

}


// =====================================
// MOSTRAR HISTORIALES
// =====================================

function mostrarHistoriales() {

    const tabla = document.getElementById("tablaHistoriales");

    tabla.innerHTML = "";

    document.getElementById("totalHistoriales").textContent =
        `${historiales.length} historiales`;

    historiales.forEach((h) => {

        const fecha = new Date(h.fechaConsulta);

        agregarFila(tabla, [
            h.paciente,
            h.medico,
            fecha.toLocaleString("es-PE"),
            `Certificado ${h.certificadoId}`
        ]);

    });

}


// =====================================
// INICIALIZAR
// =====================================

mostrarRecetas();

mostrarCertificados();

mostrarHistoriales();
