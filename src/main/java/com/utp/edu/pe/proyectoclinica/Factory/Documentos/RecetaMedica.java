package com.utp.edu.pe.proyectoclinica.Factory.Documentos;
import com.utp.edu.pe.proyectoclinica.model.Medicamento;
import com.utp.edu.pe.proyectoclinica.model.Paciente;
import com.utp.edu.pe.proyectoclinica.model.Medico;
import jakarta.persistence.*;

@Entity
@Table(name = "receta_medica")
public class RecetaMedica implements Documento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "medico_id", nullable = false)
    private Medico medico;

    @ManyToOne
    @JoinColumn(name = "medicamento_id", nullable = false)
    private Medicamento medicamento;

    @Column(name = "indicaciones")
    private String indicaciones;


    public void setIndicaciones(String indicaciones) {
        this.indicaciones = indicaciones;
    }

    public void setPaciente(Paciente paciente){
        this.paciente = paciente;
    }

    public void setMedico(Medico medico){
        this.medico = medico;
    }

    public void setMedicamento(Medicamento medicamento){
        this.medicamento = medicamento;
    }


    @Override
    public void generarDocumento(){

    }

}
