
// Obtener el elemento HTML donde mostraremos la fecha
const fechaActual = document.getElementById("fechaActual");

// Obtener la fecha del sistema
const fecha = new Date();

// Dar formato a la fecha
const fechaFormateada = fecha.toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric"
});

// Mostrar la fecha en HTML
fechaActual.textContent = fechaFormateada;
