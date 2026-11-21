package com.utp.edu.pe.proyectoclinica.model;
import jakarta.persistence.*;

@Entity
@Table(name = "medicamento")
public class Medicamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "nombre", nullable = false)
    private String nombreMedicamento;

    @Column(name = "mg", nullable = false)
    private int mg;

    public Medicamento() {
    }

    public Medicamento(Long id, String nombreMedicamento, int mg) {
        this.id = id;
        this.nombreMedicamento = nombreMedicamento;
        this.mg = mg;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreMedicamento() {
        return nombreMedicamento;
    }

    public void setNombreMedicamento(String nombreMedicamento) {
        this.nombreMedicamento = nombreMedicamento;
    }

    public int getMg() {
        return mg;
    }

    public void setMg(int mg) {
        this.mg = mg;
    }
}
