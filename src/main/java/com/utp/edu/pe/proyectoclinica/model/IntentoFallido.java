package com.utp.edu.pe.proyectoclinica.model;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "intento_fallido")
public class IntentoFallido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    private String motivo;

    private LocalDateTime fecha;

    public IntentoFallido() {
    }

    public IntentoFallido(String username, String motivo, LocalDateTime fecha) {
        this.username = username;
        this.motivo = motivo;
        this.fecha = fecha;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }
}
