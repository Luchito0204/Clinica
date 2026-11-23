const API_PACIENTES = "http://localhost:8080/api/pacientes";
const API_RECETAS = "http://localhost:8080/api/recetas";
const API_CERTIFICADOS = "http://localhost:8080/api/certificados";

let pacienteActual = null;

function obtenerToken() {
    return sessionStorage.getItem("token") || "";
}

function obtenerUsernameSesion() {
    return (sessionStorage.getItem("username") || "").trim();
}

function normalizar(texto) {
    return (texto || "").toString().trim().toLowerCase();
}

function abrirModal(id) {
    document.getElementById(id).hidden = false;
}

function cerrarModal(id) {
    document.getElementById(id).hidden = true;
}

document.querySelectorAll("[data-cerrar]").forEach((btn) => {
    btn.addEventListener("click", () => cerrarModal(btn.dataset.cerrar));
});

async function identificarPacienteActual() {
    const username = obtenerUsernameSesion();
    const target = normalizar(username);

    const strongTopbar = document.getElementById("nombreUsuarioTopbar");
    const smallTopbar = document.getElementById("rolUsuarioTopbar");
    const subtitulo = document.getElementById("subtituloPaciente");

    if (strongTopbar && username) {
        strongTopbar.textContent = username;
    }

    try {
        const res = await fetch(API_PACIENTES, {
            headers: { "Authorization": obtenerToken() }
        });
        const listaPacientes = res.ok ? await res.json() : [];

        pacienteActual = listaPacientes.find((p) => {
            const pUser = normalizar(p.username);
            const pCorreo = normalizar(p.correo || p.email);
            const pDni = normalizar(p.dni);
            const pNombres = normalizar(p.nombres);
            const pApellidos = normalizar(p.apellidos);
            const pNombreCompleto = `${pNombres} ${pApellidos}`.trim();

            return (
                (target && pUser === target) ||
                (target && pCorreo === target) ||
                (target && pDni === target) ||
                (target && pNombres === target) ||
                (target && pNombreCompleto === target)
            );
        }) || null;

        if (pacienteActual) {
            const nombreCompleto = `${pacienteActual.nombres || ""} ${pacienteActual.apellidos || ""}`.trim();
            if (strongTopbar && nombreCompleto) {
                strongTopbar.textContent = nombreCompleto;
            }
            if (smallTopbar) {
                smallTopbar.textContent = `Usuario: ${username || pacienteActual.dni || "Paciente"}`;
            }
            if (subtitulo) {
                subtitulo.textContent = `Paciente: ${nombreCompleto} — Solo se muestran tus documentos médicos.`;
            }
        } else if (subtitulo && username) {
            subtitulo.textContent = `Usuario: ${username} — Solo se muestran tus documentos médicos.`;
        }
    } catch (error) {
        console.error("Error al identificar paciente:", error);
    }
}

function perteneceAlPacienteActual(doc) {
    const usernameTarget = normalizar(obtenerUsernameSesion());
    const pacienteIdTarget = pacienteActual?.id;
    const nombresPacienteTarget = normalizar(
        pacienteActual ? `${pacienteActual.nombres || ""} ${pacienteActual.apellidos || ""}` : ""
    );

    const docPaciente = doc?.paciente;
    const docPacienteId = docPaciente?.id ?? doc?.pacienteId;

    if (pacienteIdTarget !== undefined && pacienteIdTarget !== null && docPacienteId !== undefined && docPacienteId !== null) {
        return Number(docPacienteId) === Number(pacienteIdTarget);
    }

    const candidatosTexto = [
        doc?.username,
        doc?.pacienteNombre,
        docPaciente?.username,
        docPaciente?.correo,
        docPaciente?.email,
        docPaciente?.dni,
        docPaciente ? `${docPaciente.nombres || ""} ${docPaciente.apellidos || ""}` : ""
    ].map(normalizar).filter(Boolean);

    return candidatosTexto.some((texto) => {
        const coincideUser = usernameTarget && (texto === usernameTarget || texto.includes(usernameTarget));
        const coincideNombre = nombresPacienteTarget && (texto === nombresPacienteTarget || texto.includes(nombresPacienteTarget));
        return coincideUser || coincideNombre;
    });
}

function formatearMedico(medico, fallbackNombre) {
    if (medico && typeof medico === "object") {
        return `Dr. ${medico.nombre || ""} ${medico.apellido || ""}`.trim();
    }
    return fallbackNombre || "—";
}

async function verRecetaMedica() {
    const titulo = document.getElementById("tituloModalDoc");
    const cuerpo = document.getElementById("cuerpoModalDoc");

    titulo.textContent = "Mi Receta Médica (Solo lectura)";
    cuerpo.innerHTML = "<p>Buscando tu receta médica...</p>";
    abrirModal("modalDocumentoPaciente");

    try {
        if (!pacienteActual) {
            await identificarPacienteActual();
        }

        const res = await fetch(API_RECETAS, {
            headers: { "Authorization": obtenerToken() }
        });
        const todasRecetas = res.ok ? await res.json() : [];
        const misRecetas = todasRecetas.filter(perteneceAlPacienteActual);

        if (!misRecetas.length) {
            cuerpo.innerHTML = "<p>No hay recetas médicas registradas para tu cuenta.</p>";
            return;
        }

        cuerpo.innerHTML = misRecetas.map((r) => {
            const med = r.medicamento
                ? (typeof r.medicamento === "string"
                    ? r.medicamento
                    : `${r.medicamento.nombre ?? r.medicamento.nombreMedicamento ?? ""} ${r.medicamento.mg ? `(${r.medicamento.mg} mg)` : ""}`.trim())
                : (r.medicamentoNombre ?? "—");

            const medicoTxt = formatearMedico(r.medico, r.medicoNombre);

            return `
                <div style="padding:14px; border:1px solid #CBD5E1; border-radius:8px; margin-bottom:12px; background:#F8FAFC;">
                    <p><strong>Medicamento:</strong> ${med || "—"}</p>
                    <p><strong>Indicaciones:</strong> ${r.indicaciones ?? "—"}</p>
                    <p><strong>Médico:</strong> ${medicoTxt}</p>
                </div>
            `;
        }).join("");
    } catch (error) {
        console.error(error);
        cuerpo.innerHTML = "<p>Error al consultar tu receta médica.</p>";
    }
}

async function verCertificadoMedico() {
    const titulo = document.getElementById("tituloModalDoc");
    const cuerpo = document.getElementById("cuerpoModalDoc");

    titulo.textContent = "Mi Certificado Médico (Solo lectura)";
    cuerpo.innerHTML = "<p>Buscando tu certificado médico...</p>";
    abrirModal("modalDocumentoPaciente");

    try {
        if (!pacienteActual) {
            await identificarPacienteActual();
        }

        const res = await fetch(API_CERTIFICADOS, {
            headers: { "Authorization": obtenerToken() }
        });
        const todosCertificados = res.ok ? await res.json() : [];
        const misCertificados = todosCertificados.filter(perteneceAlPacienteActual);

        if (!misCertificados.length) {
            cuerpo.innerHTML = "<p>No hay certificados médicos registrados para tu cuenta.</p>";
            return;
        }

        cuerpo.innerHTML = misCertificados.map((c) => {
            const fechaRaw = c.fechaEmision ?? c.fechaEmicion;
            const fechaTxt = fechaRaw ? new Date(fechaRaw).toLocaleString("es-PE") : "—";
            const medicoTxt = formatearMedico(c.medico, c.medicoNombre);

            return `
                <div style="padding:14px; border:1px solid #CBD5E1; border-radius:8px; margin-bottom:12px; background:#F8FAFC;">
                    <p><strong>Diagnóstico:</strong> ${c.diagnostico ?? "—"}</p>
                    <p><strong>Fecha de emisión:</strong> ${fechaTxt}</p>
                    <p><strong>Médico:</strong> ${medicoTxt}</p>
                </div>
            `;
        }).join("");
    } catch (error) {
        console.error(error);
        cuerpo.innerHTML = "<p>Error al consultar tu certificado médico.</p>";
    }
}

document.getElementById("btnVerReceta").addEventListener("click", verRecetaMedica);
document.getElementById("menuVerReceta").addEventListener("click", (e) => {
    e.preventDefault();
    verRecetaMedica();
});

document.getElementById("btnVerCertificado").addEventListener("click", verCertificadoMedico);
document.getElementById("menuVerCertificado").addEventListener("click", (e) => {
    e.preventDefault();
    verCertificadoMedico();
});

identificarPacienteActual();