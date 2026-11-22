
const formulario = document.getElementById("formularioTarifa");
const resultado = document.getElementById("resultadoTarifa");

formulario.addEventListener("submit", async function(event) {

    // Evita que el formulario recargue la página
    event.preventDefault();

    // Obtener los valores ingresados
    const tipoPaciente = document.getElementById("tipoPaciente").value;
    const montoBase = parseFloat(
        document.getElementById("montoBase").value
    );

    // Validar el monto
    if (!tipoPaciente || isNaN(montoBase) || montoBase <= 0) {
        resultado.textContent = "Ingresa un tipo de paciente y un monto válido.";
        return;
    }

    resultado.textContent = "Calculando tarifa...";

    try {

        // Preparar la dirección con los parámetros
        const url = `http://localhost:8080/calcular?tipoPaciente=${encodeURIComponent(tipoPaciente)}&montoBase=${encodeURIComponent(montoBase)}`;

        // Enviar la petición al backend
        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error("No se pudo calcular la tarifa.");
        }

        // Recibir el texto que devuelve Java
        const mensaje = await respuesta.text();

        // Mostrar el resultado
        resultado.textContent = mensaje;

    } catch (error) {

        resultado.textContent =
            "Error al conectar con el servidor. Verifica que Spring Boot esté ejecutándose.";

        console.error(error);
    }

});
