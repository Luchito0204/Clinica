const API_BOTICA = "http://localhost:8080/api/botica";

const buscarReceta = document.getElementById("buscarReceta");
const tablaRecetas = document.getElementById("tablaRecetas");
const totalRecetas = document.getElementById("totalRecetas");

const buscarMedicamento = document.getElementById("buscarMedicamento");
const tablaMedicamentos = document.getElementById("tablaMedicamentos");
const totalMedicamentos = document.getElementById("totalMedicamentos");

function crearCelda(texto) {
    const td = document.createElement("td");
    td.textContent = texto;
    return td;
}

function filaVacia(tbody, columnas, mensaje) {
    const fila = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = columnas;
    td.textContent = mensaje;
    fila.appendChild(td);
    tbody.appendChild(fila);
}

// Pide datos a la botica enviando el token del login; el backend valida el rol.
async function pedirDatos(ruta, parametros) {
    const url = new URL(`${API_BOTICA}/${ruta}`);
    Object.entries(parametros).forEach(([clave, valor]) => {
        if (valor) url.searchParams.set(clave, valor);
    });

    const respuesta = await fetch(url, {
        headers: { "Authorization": obtenerTokenSesion() }
    });

    if (respuesta.status === 401) {
        alert("Tu sesión no es válida. Inicia sesión nuevamente.");
        cerrarSesion();
        throw new Error("Sesión inválida");
    }

    if (respuesta.status === 403) {
        throw new Error("Tu rol no tiene permiso para ver esta información.");
    }

    if (!respuesta.ok) {
        throw new Error("Código " + respuesta.status);
    }

    return respuesta.json();
}

function mostrarRecetas(recetas) {
    tablaRecetas.innerHTML = "";
    totalRecetas.textContent = `${recetas.length} recetas`;

    if (!recetas.length) {
        filaVacia(tablaRecetas, 5, "No se encontraron recetas.");
        return;
    }

    recetas.forEach((receta) => {
        const fila = document.createElement("tr");

        fila.appendChild(crearCelda(receta.paciente));
        fila.appendChild(crearCelda(receta.medico));
        fila.appendChild(crearCelda(receta.medicamento));
        fila.appendChild(crearCelda(`${receta.mg} mg`));
        fila.appendChild(crearCelda(receta.indicaciones || "Sin indicaciones"));

        tablaRecetas.appendChild(fila);
    });
}

function mostrarMedicamentos(medicamentos) {
    tablaMedicamentos.innerHTML = "";
    totalMedicamentos.textContent = `${medicamentos.length} medicamentos`;

    if (!medicamentos.length) {
        filaVacia(tablaMedicamentos, 4, "No se encontraron medicamentos.");
        return;
    }

    medicamentos.forEach((medicamento) => {
        const fila = document.createElement("tr");

        fila.appendChild(crearCelda(medicamento.id));
        fila.appendChild(crearCelda(medicamento.nombreMedicamento));
        fila.appendChild(crearCelda(`${medicamento.mg} mg`));
        fila.appendChild(crearCelda(medicamento.stock));

        tablaMedicamentos.appendChild(fila);
    });
}

async function cargarRecetas() {
    try {
        const recetas = await pedirDatos("recetas", { paciente: buscarReceta.value.trim() });
        mostrarRecetas(recetas);
    } catch (error) {
        if (error.message === "Sesión inválida") return;
        console.error(error);
        alert("No se pudo cargar las recetas. (" + error.message + ")");
    }
}

async function cargarMedicamentos() {
    try {
        const medicamentos = await pedirDatos("medicamentos", { nombre: buscarMedicamento.value.trim() });
        mostrarMedicamentos(medicamentos);
    } catch (error) {
        if (error.message === "Sesión inválida") return;
        console.error(error);
        alert("No se pudo cargar los medicamentos. (" + error.message + ")");
    }
}

// Espera a que el usuario deje de escribir antes de consultar al servidor.
function conRetraso(funcion, milisegundos = 300) {
    let temporizador;
    return () => {
        clearTimeout(temporizador);
        temporizador = setTimeout(funcion, milisegundos);
    };
}

buscarReceta.addEventListener("input", conRetraso(cargarRecetas));
buscarMedicamento.addEventListener("input", conRetraso(cargarMedicamentos));

cargarRecetas();
cargarMedicamentos();
