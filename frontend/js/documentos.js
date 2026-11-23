const API_PACIENTES = "http://localhost:8080/api/pacientes";
const API_MEDICOS = "http://localhost:8080/api/medicos";
const API_MEDICAMENTOS = "http://localhost:8080/api/medicamentos";
const API_RECETAS = "http://localhost:8080/api/recetas";
const API_CERTIFICADOS = "http://localhost:8080/api/certificados";
const API_HISTORIALES = "http://localhost:8080/api/historiales";


let pacientes = [];
let medicos = [];
let medicamentos = [];
let recetas = [];
let certificados = [];
let historiales = [];


const pestañas = document.querySelectorAll(".tab-documento");


function obtenerTokenSesion() {
    return sessionStorage.getItem("token") || localStorage.getItem("token") || "";
}


pestañas.forEach((pestaña) => {
    pestaña.addEventListener("click", () => {
        const tipo = pestaña.dataset.tipo;

        pestañas.forEach((p) => p.classList.remove("activo"));
        document.querySelectorAll(".documento-seccion")
            .forEach((seccion) => seccion.classList.remove("activa"));

        pestaña.classList.add("activo");
        document.getElementById(`seccion-${tipo}`).classList.add("activa");
    });
});


function abrirModal(id) {
    document.getElementById(id).hidden = false;
}

function cerrarModal(id) {
    document.getElementById(id).hidden = true;
    const formulario = document.querySelector(`#${id} form`);
    if (formulario) formulario.reset();
}

document.querySelectorAll("[data-cerrar]").forEach((boton) => {
    boton.addEventListener("click", () => {
        cerrarModal(boton.dataset.cerrar);
    });
});

async function cargarCatalogos() {
    try {
        const [resPacientes, resMedicos, resMedicamentos] = await Promise.all([
            fetch(API_PACIENTES),
            fetch(API_MEDICOS),
            fetch(API_MEDICAMENTOS)
        ]);

        if (!resPacientes.ok || !resMedicos.ok) {
            throw new Error("No se pudieron cargar pacientes o médicos");
        }

        pacientes = await resPacientes.json();
        medicos = await resMedicos.json();
        medicamentos = resMedicamentos.ok ? await resMedicamentos.json() : [];

        return pacientes.length > 0 && medicos.length > 0;
    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar los catálogos. Verifica que el backend esté encendido.");
        return false;
    }
}

async function cargarCertificadosBackend() {
    try {
        const respuesta = await fetch(API_CERTIFICADOS);
        if (!respuesta.ok) throw new Error("Código " + respuesta.status);
        certificados = await respuesta.json();
        cargarCertificadosSelect();
    } catch (error) {
        console.error(error);
        certificados = [];
        cargarCertificadosSelect();
    }
}


function cargarOpciones(id, lista, obtenerTexto, obtenerValor) {
    const select = document.getElementById(id);
    select.innerHTML = "";

    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";
    opcionInicial.textContent = "Seleccionar opción";
    select.appendChild(opcionInicial);

    lista.forEach((elemento) => {
        const opcion = document.createElement("option");
        opcion.value = obtenerValor(elemento);
        opcion.textContent = obtenerTexto(elemento);
        select.appendChild(opcion);
    });
}

function cargarPacientesSelect(id) {
    cargarOpciones(
        id,
        pacientes,
        (p) => `${p.nombres} ${p.apellidos} - DNI: ${p.dni}`,
        (p) => p.id
    );
}

function cargarMedicosSelect(id) {
    cargarOpciones(
        id,
        medicos,
        (m) => `Dr. ${m.nombre} ${m.apellido} - ${m.especialidad}`,
        (m) => m.id
    );
}

function cargarMedicamentosSelect() {
    cargarOpciones(
        "medicamentoReceta",
        medicamentos,
        (m) => `${m.nombreMedicamento ?? m.nombre} - ${m.mg ?? ""} mg`.trim(),
        (m) => m.id
    );
}

function cargarCertificadosSelect() {
    cargarOpciones(
        "certificadoHistorial",
        certificados,
        (c) => {
            const nombrePac = c.paciente
                ? `${c.paciente.nombres ?? ""} ${c.paciente.apellidos ?? ""}`.trim()
                : (c.pacienteNombre ?? "Paciente");
            return `Certificado #${c.id} - ${nombrePac}`;
        },
        (c) => c.id
    );
}

function prepararFormulario(ids) {
    cargarPacientesSelect(ids.paciente);
    cargarMedicosSelect(ids.medico);
}


async function cargarRecetas() {
    try {
        const respuesta = await fetch(API_RECETAS);
        if (!respuesta.ok) throw new Error("Código " + respuesta.status);
        recetas = await respuesta.json();
        mostrarRecetas();
    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar las recetas. Verifica que el backend esté encendido.");
    }
}

async function cargarCertificados() {
    try {
        const respuesta = await fetch(API_CERTIFICADOS);
        if (!respuesta.ok) throw new Error("Código " + respuesta.status);
        certificados = await respuesta.json();
        mostrarCertificados();
    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar los certificados. Verifica que el backend esté encendido.");
    }
}

async function cargarHistoriales() {
    try {
        const respuesta = await fetch(API_HISTORIALES, {
            headers: {
                "Authorization": obtenerTokenSesion()
            }
        });
        if (!respuesta.ok) throw new Error("Código " + respuesta.status);
        historiales = await respuesta.json();
        mostrarHistoriales();
    } catch (error) {
        console.error(error);
        const tabla = document.getElementById("tablaHistoriales");
        if (tabla) {
            tabla.innerHTML = `<tr><td colspan="5">No se pudieron cargar los historiales (${error.message}).</td></tr>`;
        }
    }
}


document.getElementById("btnNuevaReceta").addEventListener("click", async () => {
    const hayDatos = await cargarCatalogos();
    if (!hayDatos) {
        alert("Primero debes registrar al menos un paciente y un médico.");
        return;
    }
    prepararFormulario({
        paciente: "pacienteReceta",
        medico: "medicoReceta"
    });
    cargarMedicamentosSelect();
    abrirModal("modalReceta");
});

document.getElementById("formReceta").addEventListener("submit", async (e) => {
    e.preventDefault();

    const idPaciente = document.getElementById("pacienteReceta").value;
    const idMedico = document.getElementById("medicoReceta").value;
    const idMedicamento = document.getElementById("medicamentoReceta").value;
    const indicaciones = document.getElementById("indicacionesReceta").value.trim();

    if (!idPaciente || !idMedico || !idMedicamento) {
        alert("Debes seleccionar todos los datos.");
        return;
    }

    const receta = {
        pacienteId: Number(idPaciente),
        medicoId: Number(idMedico),
        medicamentoId: Number(idMedicamento),
        indicaciones
    };

    try {
        const respuesta = await fetch(API_RECETAS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(receta)
        });

        if (!respuesta.ok) throw new Error("Código " + respuesta.status);

        alert("Receta registrada correctamente.");
        cerrarModal("modalReceta");
        cargarRecetas();
    } catch (error) {
        console.error(error);
        alert("No se pudo guardar la receta. (" + error.message + ")");
    }
});


document.getElementById("btnNuevoCertificado").addEventListener("click", async () => {
    const hayDatos = await cargarCatalogos();
    if (!hayDatos) {
        alert("Primero debes registrar al menos un paciente y un médico.");
        return;
    }
    prepararFormulario({
        paciente: "pacienteCertificado",
        medico: "medicoCertificado"
    });
    abrirModal("modalCertificado");
});

document.getElementById("formCertificado").addEventListener("submit", async (e) => {
    e.preventDefault();

    const idPaciente = document.getElementById("pacienteCertificado").value;
    const idMedico = document.getElementById("medicoCertificado").value;
    const fechaEmision = document.getElementById("fechaEmision").value;
    const diagnostico = document.getElementById("diagnostico").value.trim();

    if (!idPaciente || !idMedico) {
        alert("Debes seleccionar un paciente y un médico.");
        return;
    }

    const certificado = {
        pacienteId: Number(idPaciente),
        medicoId: Number(idMedico),
        fechaEmicion: fechaEmision,
        diagnostico
    };

    try {
        const respuesta = await fetch(API_CERTIFICADOS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(certificado)
        });

        if (!respuesta.ok) throw new Error("Código " + respuesta.status);

        alert("Certificado registrado correctamente.");
        cerrarModal("modalCertificado");
        cargarCertificados();
    } catch (error) {
        console.error(error);
        alert("No se pudo guardar el certificado. (" + error.message + ")");
    }
});


document.getElementById("btnNuevoHistorial").addEventListener("click", async () => {
    const hayDatos = await cargarCatalogos();
    if (!hayDatos) {
        alert("Primero debes registrar al menos un paciente y un médico.");
        return;
    }
    prepararFormulario({
        paciente: "pacienteHistorial",
        medico: "medicoHistorial"
    });
    await cargarCertificadosBackend();
    abrirModal("modalHistorial");
});

document.getElementById("formHistorial").addEventListener("submit", async (e) => {
    e.preventDefault();

    const idPaciente = document.getElementById("pacienteHistorial").value;
    const idMedico = document.getElementById("medicoHistorial").value;
    const idCertificado = document.getElementById("certificadoHistorial").value;
    const fechaConsulta = document.getElementById("fechaConsulta").value;

    if (!idPaciente || !idMedico || !idCertificado) {
        alert("Debes seleccionar todos los datos.");
        return;
    }

    const certificadoSeleccionado = certificados.find(
        (c) => Number(c.id) === Number(idCertificado)
    );

    const certPacienteId = certificadoSeleccionado?.paciente?.id ?? certificadoSeleccionado?.pacienteId;
    const certMedicoId = certificadoSeleccionado?.medico?.id ?? certificadoSeleccionado?.medicoId;

    if (
        certificadoSeleccionado &&
        ((certPacienteId !== undefined && Number(certPacienteId) !== Number(idPaciente)) ||
            (certMedicoId !== undefined && Number(certMedicoId) !== Number(idMedico)))
    ) {
        alert("El certificado debe pertenecer al paciente y médico seleccionados.");
        return;
    }

    const historial = {
        pacienteId: Number(idPaciente),
        medicoId: Number(idMedico),
        certificadoId: Number(idCertificado),
        fechaConsulta
    };

    try {
        const respuesta = await fetch(API_HISTORIALES, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": obtenerTokenSesion()
            },
            body: JSON.stringify(historial)
        });

        if (!respuesta.ok) throw new Error("Código " + respuesta.status);

        alert("Historial médico registrado correctamente.");
        cerrarModal("modalHistorial");
        cargarHistoriales();
    } catch (error) {
        console.error(error);
        alert("No se pudo guardar el historial médico. (" + error.message + ")");
    }
});


function actualizarPaso(idElemento, texto, estado) {
    const el = document.getElementById(idElemento);
    if (!el) return;
    el.textContent = texto;

    if (estado === "ok") {
        el.style.background = "#DCFCE7";
        el.style.borderColor = "#86EFAC";
        el.style.color = "#166534";
    } else if (estado === "error") {
        el.style.background = "#FEE2E2";
        el.style.borderColor = "#FCA5A5";
        el.style.color = "#991B1B";
    } else {
        el.style.background = "#F8FAFC";
        el.style.borderColor = "#E2E8F0";
        el.style.color = "#334155";
    }
}

function esperar(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function consultarHistorialConfidencial(id) {
    const detalleBox = document.getElementById("detalleHistorialConfidencial");
    detalleBox.style.display = "none";
    detalleBox.innerHTML = "";

    actualizarPaso("pasoToken", " 1. Validando token de sesión...", "pendiente");
    actualizarPaso("pasoCadena", " 2. Ejecutando cadena de seguridad (Auth → Rol → Auditoría)...", "pendiente");
    actualizarPaso("pasoProxy", " 3. Consultando Proxy de recurso sensible...", "pendiente");

    abrirModal("modalSeguridadHistorial");

    const token = obtenerTokenSesion();
    await esperar(350);

    if (!token) {
        actualizarPaso("pasoToken", " 1. Token no encontrado en la sesión.", "error");
        actualizarPaso("pasoCadena", " 2. Cadena detenida por falta de autenticación.", "error");
        actualizarPaso("pasoProxy", " 3. Proxy bloqueó el acceso al historial.", "error");
        return;
    }

    const tokenPreview = token.length > 22 ? token.substring(0, 22) + "..." : token;
    actualizarPaso("pasoToken", ` 1. Token detectado (${tokenPreview})`, "ok");

    await esperar(350);
    actualizarPaso("pasoCadena", " 2. Enviando solicitud al backend (Chain + Proxy)...", "pendiente");

    try {
        const respuesta = await fetch(`${API_HISTORIALES}/${id}`, {
            method: "GET",
            headers: {
                "Authorization": token
            }
        });

        const data = await respuesta.json().catch(() => ({}));
        await esperar(350);

        if (!respuesta.ok) {
            actualizarPaso("pasoCadena", " 2. Validación de seguridad rechazada (" + respuesta.status + ")", "error");
            actualizarPaso("pasoProxy", ` 3. Proxy denegó el acceso: ${data.error || "No autorizado"}`, "error");
            return;
        }

        actualizarPaso("pasoCadena", " 2. Cadena de seguridad superada (Autenticación, Autorización y Auditoría).", "ok");
        actualizarPaso("pasoProxy", "3. Proxy verificó el token y concedió acceso al recurso real.", "ok");

        const paciente = formatearPaciente(data.paciente);
        const medico = formatearMedico(data.medico);
        const fecha = data.fechaConsulta ? new Date(data.fechaConsulta).toLocaleString("es-PE") : "—";
        const cert = data.certificadoMedico;
        const diagnostico = cert?.diagnostico ?? "Sin diagnóstico registrado";

        detalleBox.innerHTML = `
            <strong> Documento Confidencial #${data.id}</strong><br>
            <strong>Paciente:</strong> ${paciente}<br>
            <strong>Médico tratante:</strong> ${medico}<br>
            <strong>Fecha de consulta:</strong> ${fecha}<br>
            <strong>Certificado asociado:</strong> #${cert?.id ?? "—"}<br>
            <strong>Diagnóstico confidencial:</strong> ${diagnostico}
        `;
        detalleBox.style.display = "block";
    } catch (error) {
        console.error(error);
        actualizarPaso("pasoProxy", "3. Error de conexión con el servidor.", "error");
    }
}


function agregarFila(tabla, valores) {
    const fila = document.createElement("tr");

    valores.forEach((valor) => {
        const celda = document.createElement("td");
        celda.textContent = valor;
        fila.appendChild(celda);
    });

    tabla.appendChild(fila);
}

function formatearPaciente(paciente) {
    if (!paciente) return "—";
    if (typeof paciente === "string") return paciente;
    return `${paciente.nombres ?? ""} ${paciente.apellidos ?? ""}`.trim() || "—";
}

function formatearMedico(medico) {
    if (!medico) return "—";
    if (typeof medico === "string") return medico;
    return `${medico.nombre ?? ""} ${medico.apellido ?? ""}`.trim() || "—";
}

function mostrarRecetas() {
    const tabla = document.getElementById("tablaRecetas");
    tabla.innerHTML = "";
    document.getElementById("totalRecetas").textContent = `${recetas.length} recetas`;

    recetas.forEach((r) => {
        const pacienteTexto = r.paciente
            ? formatearPaciente(r.paciente)
            : (r.pacienteNombre ?? "—");

        const medicoTexto = r.medico
            ? formatearMedico(r.medico)
            : (r.medicoNombre ?? "—");

        const medicamentoTexto = r.medicamento
            ? (typeof r.medicamento === "string"
                ? r.medicamento
                : `${r.medicamento.nombre ?? r.medicamento.nombreMedicamento ?? ""} ${r.medicamento.mg ? `- ${r.medicamento.mg} mg` : ""}`.trim() || "—")
            : (r.medicamentoNombre ?? "—");

        agregarFila(tabla, [
            pacienteTexto,
            medicoTexto,
            medicamentoTexto,
            r.indicaciones ?? "—"
        ]);
    });
}

function mostrarCertificados() {
    const tabla = document.getElementById("tablaCertificados");
    tabla.innerHTML = "";
    document.getElementById("totalCertificados").textContent = `${certificados.length} certificados`;

    certificados.forEach((c) => {
        const fechaRaw = c.fechaEmision ?? c.fechaEmicion;
        const fecha = fechaRaw ? new Date(fechaRaw).toLocaleString("es-PE") : "—";

        agregarFila(tabla, [
            formatearPaciente(c.paciente),
            formatearMedico(c.medico),
            fecha,
            c.diagnostico ?? "—"
        ]);
    });
}

function mostrarHistoriales() {
    const tabla = document.getElementById("tablaHistoriales");
    tabla.innerHTML = "";
    document.getElementById("totalHistoriales").textContent = `${historiales.length} historiales`;

    historiales.forEach((h) => {
        const fecha = h.fechaConsulta ? new Date(h.fechaConsulta).toLocaleString("es-PE") : "—";
        const certId = h.certificadoMedico?.id ?? h.certificado?.id ?? h.certificadoId ?? "—";

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${formatearPaciente(h.paciente)}</td>
            <td>${formatearMedico(h.medico)}</td>
            <td>${fecha}</td>
            <td>Certificado ${certId}</td>
            <td>
                <button type="button" class="btn-editar" onclick="consultarHistorialConfidencial(${h.id})">
                     Ver confidencial
                </button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}


cargarRecetas();
cargarCertificados();
cargarHistoriales();