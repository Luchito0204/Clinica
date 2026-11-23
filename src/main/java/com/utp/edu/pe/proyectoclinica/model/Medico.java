package com.utp.edu.pe.proyectoclinica.model;
import jakarta.persistence.*;

@Entity
@Table(name = "medico")
public class Medico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Column(nullable = false)
    private String especialidad;

    @Column(nullable = false)
    private String colegioMedico;

    public Medico() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long medico_id) {
        this.id = medico_id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public String getColegioMedico() {
        return colegioMedico;
    }

    public void setColegioMedico(String colegioMedico) {
        this.colegioMedico = colegioMedico;
    }
}
