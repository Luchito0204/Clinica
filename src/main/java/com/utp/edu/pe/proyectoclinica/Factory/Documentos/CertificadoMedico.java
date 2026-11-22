package com.utp.edu.pe.proyectoclinica.Factory.Documentos;
import com.utp.edu.pe.proyectoclinica.model.Medico;
import com.utp.edu.pe.proyectoclinica.model.Paciente;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="certificado_medico")
public class CertificadoMedico implements Documento{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    private LocalDateTime fechaEmicion;

    @Column(nullable = false)
    private String diagnostico;

    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "medico_id", nullable = false)
    private Medico medico;

    public void setPaciente (Paciente paciente){
        this.paciente = paciente;
    }

    public void setMedico (Medico medico){
        this.medico = medico;
    }

    public void setFechaEmicion (LocalDateTime fechaEmicion){
        this.fechaEmicion = fechaEmicion;
    }

    public void setDiagnostico (String diagnostico){
        this.diagnostico = diagnostico;
    }

    @Override
    public void generarDocumento(){
        
    }
}