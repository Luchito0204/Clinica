package com.utp.edu.pe.proyectoclinica.model;
import jakarta.persistence.*;

@Entity
@Table(name = "medico")
public class Medico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    private String Nombre;

    @Column(nullable = false)
    private String Apellido;

    @Column(nullable = false)
    private String Especialidad;

    @Column(nullable = false)
    private String ColegioMedico;

    public Medico() {
    }

    public Medico(Long id, String nombre, String apellido, String especialidad, String colegioMedico) {
        this.id = id;
        Nombre = nombre;
        Apellido = apellido;
        Especialidad = especialidad;
        ColegioMedico = colegioMedico;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long medico_id) {
        this.id = medico_id;
    }

    public String getNombre() {
        return Nombre;
    }

    public void setNombre(String nombre) {
        Nombre = nombre;
    }

    public String getApellido() {
        return Apellido;
    }

    public void setApellido(String apellido) {
        Apellido = apellido;
    }

    public String getEspecialidad() {
        return Especialidad;
    }

    public void setEspecialidad(String especialidad) {
        Especialidad = especialidad;
    }

    public String getColegioMedico() {
        return ColegioMedico;
    }

    public void setColegioMedico(String colegioMedico) {
        ColegioMedico = colegioMedico;
    }
}
