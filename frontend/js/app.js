const API_BASE = "http://localhost:8080/api";
const ENDPOINTS = {
    pacientes: `${API_BASE}/pacientes`,
    medicos: `${API_BASE}/medicos`,
    citas: `${API_BASE}/agendar-cita`,
    medicamentos: `${API_BASE}/medicamentos`
};


const fechaActual = document.getElementById("fechaActual");
if (fechaActual) {
    const fecha = new Date();
    fechaActual.textContent = fecha.toLocaleDateString("es-PE", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


function formatearNombrePaciente(c) {
    const p = c.paciente;
    if (!p) return c.pacienteNombre ?? c.nombrePaciente ?? "—";
    if (typeof p === "string") return p;
    return `${p.nombres ?? p.nombre ?? ""} ${p.apellidos ?? p.apellido ?? ""}`.trim() || "—";
}

function formatearNombreMedico(c) {
    const m = c.medico;
    if (!m) return c.medicoNombre ?? c.nombreMedico ?? "—";
    if (typeof m === "string") return m;
    return `${m.nombre ?? m.nombres ?? ""} ${m.apellido ?? m.apellidos ?? ""}`.trim() || "—";
}

function extraerFechaYHora(c) {
    const raw = c.fechaHora ?? c.fechaCita ?? c.fecha ?? "";
    let fechaTexto = c.fecha ?? "—";
    let horaTexto = c.hora ?? "—";

    if (raw) {
        const d = new Date(raw);
        if (!Number.isNaN(d.getTime())) {
            fechaTexto = d.toLocaleDateString("es-PE");
            if (!c.hora) {
                horaTexto = d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
            }
        }
    }
    return { fechaTexto, horaTexto };
}

function renderizarEstado(estadoRaw) {
    const estado = String(estadoRaw ?? "Pendiente");
    const clase = estado.toLowerCase().includes("atendid") ? "atendida" : "pendiente";
    return `<span class="estado ${clase}">${estado}</span>`;
}


// Cargar los datos al index


async function obtenerLista(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} -> ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

function renderizarUltimasCitas(citas) {
    const tbody = document.getElementById("tablaUltimasCitas");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (!citas.length) {
        tbody.innerHTML = `<tr><td colspan="5">No hay citas registradas.</td></tr>`;
        return;
    }

    // Últimas 5 citas registradas

    const ultimas = [...citas].reverse().slice(0, 5);

    ultimas.forEach((c) => {
        const { fechaTexto, horaTexto } = extraerFechaYHora(c);
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${formatearNombrePaciente(c)}</td>
            <td>${formatearNombreMedico(c)}</td>
            <td>${fechaTexto}</td>
            <td>${horaTexto}</td>
            <td>${renderizarEstado(c.estado)}</td>
        `;
        tbody.appendChild(tr);
    });
}

async function cargarDashboard() {
    const [resPac, resMed, resCit, resMedica] = await Promise.allSettled([
        obtenerLista(ENDPOINTS.pacientes),
        obtenerLista(ENDPOINTS.medicos),
        obtenerLista(ENDPOINTS.citas),
        obtenerLista(ENDPOINTS.medicamentos)
    ]);

    const pacientes = resPac.status === "fulfilled" ? resPac.value : [];
    const medicos = resMed.status === "fulfilled" ? resMed.value : [];
    const citas = resCit.status === "fulfilled" ? resCit.value : [];
    const medicamentos = resMedica.status === "fulfilled" ? resMedica.value : [];

    document.getElementById("totalPacientes").textContent = pacientes.length;
    document.getElementById("totalMedicos").textContent = medicos.length;
    document.getElementById("totalCitas").textContent = citas.length;
    document.getElementById("totalMedicamentos").textContent = medicamentos.length;

    renderizarUltimasCitas(citas);
}

cargarDashboard();