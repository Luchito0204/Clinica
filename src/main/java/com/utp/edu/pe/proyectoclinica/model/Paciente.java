package com.utp.edu.pe.proyectoclinica.model;
import jakarta.persistence.*;

@Entity
@Table(name="paciente")
public class Paciente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    private String Nombres;

    @Column(nullable = false)
    private String Apellidos;

    @Column(nullable = false, unique = true)
    private String dni;

    @Column(nullable = false)
    private String fechaNacimiento;

    @Column(nullable = false)
    private String estadoCivil;

    @Column(nullable = false)
    private int edad;


    public Paciente() {
    }

    public Paciente(Long id, String nombres, String apellidos, String dni, String fechaNacimiento, String estadoCivil, int edad) {
        this.id = id;
        this.Nombres = nombres;
        this.Apellidos = apellidos;
        this.dni = dni;
        this.fechaNacimiento = fechaNacimiento;
        this.estadoCivil = estadoCivil;
        this.edad = edad;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getNombres() {
        return Nombres;
    }

    public void setNombres(String nombres) {
        Nombres = nombres;
    }

    public String getApellidos() {
        return Apellidos;
    }

    public void setApellidos(String apellidos) {
        Apellidos = apellidos;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(String fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getEstadoCivil() {
        return estadoCivil;
    }

    public void setEstadoCivil(String estadoCivil) {
        this.estadoCivil = estadoCivil;
    }

    public int getEdad(){
        return edad;
    }
    public void setEdad(int edad){
        this.edad = edad;
    }
}

