package com.utp.edu.pe.proyectoclinica.dto;

public class RecetaRequestDTO {
    private Long pacienteId;
    private Long medicoId;
    private String indicaciones;
    private Long medicamentoId;

    public Long getPacienteId() { return pacienteId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }

    public Long getMedicoId() { return medicoId; }
    public void setMedicoId(Long medicoId) { this.medicoId = medicoId; }

    public String getIndicaciones() { return indicaciones; }
    public void setIndicaciones(String indicaciones) { this.indicaciones = indicaciones; }

    public Long getMedicamentoId(){
        return medicamentoId;
    }
    public void setMedicamentoId(Long medicamentoId){
        this.medicamentoId = medicamentoId;
    }
}
