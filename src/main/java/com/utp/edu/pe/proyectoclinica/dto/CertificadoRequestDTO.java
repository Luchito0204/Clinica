package com.utp.edu.pe.proyectoclinica.dto;

import java.time.LocalDateTime;

public class CertificadoRequestDTO {
    private Long pacienteId;
    private Long medicoId;
    private String diagnostico;
    private LocalDateTime fechaEmicion;

    public Long getPacienteId() {
        return pacienteId;
    }

    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
    }

    public Long getMedicoId() {
        return medicoId;
    }

    public void setMedicoId(Long medicoId) {
        this.medicoId = medicoId;
    }

    public String getDiagnostico() {
        return diagnostico;
    }

    public void setDiagnostico(String diagnostico) {
        this.diagnostico = diagnostico;
    }

    public LocalDateTime getFechaEmicion() {
        return fechaEmicion;
    }

    public void setFechaEmicion(LocalDateTime fechaEmicion) {
        this.fechaEmicion = fechaEmicion;
    }
}
