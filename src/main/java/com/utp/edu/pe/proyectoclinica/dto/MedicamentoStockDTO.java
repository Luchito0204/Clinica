package com.utp.edu.pe.proyectoclinica.dto;

public record MedicamentoStockDTO(
        Long id,
        String nombreMedicamento,
        int mg,
        int stock
) {
}
