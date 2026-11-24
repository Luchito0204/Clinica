package com.utp.edu.pe.proyectoclinica.model;
import jakarta.persistence.*;

@Entity
@Table(name="usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;
    private String rol;
    private Integer intentosFallidos = 0;

    public Usuario() {
    }

    public Usuario(Long id, String username, String password, String rol, int intentosFallidos) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.rol = rol;
        this.intentosFallidos = intentosFallidos;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public int getIntentosFallidos() {
        return intentosFallidos != null ? intentosFallidos : 0;
    }

    public void setIntentosFallidos(int intentosFallidos) {
        this.intentosFallidos = intentosFallidos;
    }
}
