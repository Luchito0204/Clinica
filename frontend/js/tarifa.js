const API_CALCULAR_TARIFA = "http://localhost:8080/calcular";

const formulario = document.getElementById("formularioTarifa");
const resultado = document.getElementById("resultadoTarifa");

formulario.addEventListener("submit", async function (event) {
    event.preventDefault();

    const tipoPaciente = document.getElementById("tipoPaciente").value;
    const montoBase = parseFloat(document.getElementById("montoBase").value);

    if (!tipoPaciente || isNaN(montoBase) || montoBase <= 0) {
        resultado.textContent = "Ingresa un tipo de paciente y un monto válido.";
        return;
    }

    resultado.textContent = "Calculando tarifa...";

    try {
        const params = new URLSearchParams({
            tipoPaciente,
            montoBase: String(montoBase)
        });

        const respuesta = await fetch(`${API_CALCULAR_TARIFA}?${params.toString()}`);

        if (!respuesta.ok) {
            throw new Error("Código " + respuesta.status);
        }

        const mensaje = await respuesta.text();
        resultado.textContent = mensaje;
    } catch (error) {
        console.error(error);
        resultado.textContent =
            "Error al calcular la tarifa. Verifica que Spring Boot esté ejecutándose y tenga CORS habilitado.";
    }
});