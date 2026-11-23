package com.utp.edu.pe.proyectoclinica.Factory.Documentos;
import jakarta.persistence.*;
import com.utp.edu.pe.proyectoclinica.model.Paciente;
import com.utp.edu.pe.proyectoclinica.model.Medico;
import com.utp.edu.pe.proyectoclinica.Factory.Documentos.CertificadoMedico;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_Medico")
public class HistorialMedico implements Documento{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    private LocalDateTime fechaConsulta;

    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name="medico_id", nullable = false)
    private Medico medico;

    @ManyToOne
    @JoinColumn(name = "certificado_id", nullable = false)
    private CertificadoMedico certificadoMedico;

    public void setMedico (Medico medico){
        this.medico = medico;
    }

    public void setPaciente(Paciente paciente){
        this.paciente = paciente;
    }

    public void setFechaConsulta(LocalDateTime fechaConsulta){
        this.fechaConsulta = fechaConsulta;
    }

    public void setCertificadoMedico(CertificadoMedico certificadoMedico){
        this.certificadoMedico = certificadoMedico;
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getFechaConsulta() {
        return fechaConsulta;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public Medico getMedico() {
        return medico;
    }

    public CertificadoMedico getCertificadoMedico() {
        return certificadoMedico;
    }

    @Override
    public void generarDocumento(){

    }

}
