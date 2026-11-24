package com.utp.edu.pe.proyectoclinica.dto;

// Vista de solo lectura para Botica: nombre del paciente y datos de la receta,
// sin DNI, telefono ni correo del paciente.
public record RecetaBoticaDTO(
        Long id,
        String paciente,
        String medico,
        String medicamento,
        int mg,
        String indicaciones
) {
}
