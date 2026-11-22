const JAVA_API_URL = 'http://localhost:8080';

// 1. AUTENTICACIÓN (AuthController -> AuthFactory + Strategy + Observer)
document.getElementById('formLogin').addEventListener('submit', async (e) => {
    e.preventDefault();
    const proveedor = document.getElementById('authProveedor').value;
    const usuario = document.getElementById('loginUser').value;
    const log = document.getElementById('logAuth');

    try {
        // Intento real hacia tu AuthController en Spring Boot
        const res = await fetch(`${JAVA_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ proveedor, usuario })
        });
        const data = await res.json();
        log.textContent = `[Spring Boot] ${JSON.stringify(data)}`;
    } catch {
        // Fallback demostrando el flujo interno de tus clases Java
        log.textContent = `[Demo] AuthFactory creó ${proveedor === 'INTERNO' ? 'ProvedorInterno' : 'ProvedorExterno'}. LoginSubject notificó a AlertaSeguridadObserver para el usuario "${usuario}".`;
    }
});

// 2. TARIFAS (TarifaController -> CalcularTarifa + TarifaConsultaStrategy)
document.getElementById('formTarifa').addEventListener('submit', async (e) => {
    e.preventDefault();
    const tipo = document.getElementById('tipoTarifa').value;
    const base = parseFloat(document.getElementById('montoBase').value);
    const log = document.getElementById('logTarifa');

    let factor = 1;
    let claseUsada = 'TarifaBasica';
    if (tipo === 'CONVENIO_UTP') { factor = 0.7; claseUsada = 'TarifaConvenioUTP'; }
    if (tipo === 'PARTICULAR') { factor = 1.25; claseUsada = 'TarifaParticular'; }

    const total = (base * factor).toFixed(2);
    log.textContent = `Estrategia: ${claseUsada} | Base: S/ ${base} -> Total Final: S/ ${total}`;
});

// 3. DOCUMENTOS (DocumentoController -> Factory de Documentos)
document.getElementById('formDocumento').addEventListener('submit', (e) => {
    e.preventDefault();
    const tipo = document.getElementById('tipoDocumento').value;
    const paciente = document.getElementById('docPaciente').value;
    const log = document.getElementById('logDocumento');

    const mapaClases = {
        RECETA: 'RecetaMedica',
        CERTIFICADO: 'CertificadoMedico',
        HISTORIAL: 'HistorialMedico'
    };

    log.textContent = `Instanciado objeto [${mapaClases[tipo]}] para el paciente "${paciente}" listo para persistir en Repository.`;
});

// 4. RECURSO SENSIBLE (RecursoSensibleProxy + ConfiguracionSeguridadSingleton)
function accederRecurso(rol) {
    const log = document.getElementById('logProxy');
    if (rol === 'ADMIN') {
        log.style.color = '#34d399';
        log.textContent = `ACCESO CONCEDIDO: RecursoSensibleProxy validó el rol ADMIN y delegó la petición a RecursoSensibleReal.`;
    } else {
        log.style.color = '#f87171';
        log.textContent = `ACCESO DENEGADO: RecursoSensibleProxy bloqueó al rol ${rol} y registró el evento en AuditoriaHandler.`;
    }
}