package com.utp.edu.pe.proyectoclinica.Strategy.Autenticacion;

import org.springframework.stereotype.Component;

@Component("userPasswordStrategy")
public class AuthUserPasswordStrategy implements AutenticacionStrategy {

    @Override
    public boolean autenticar(String username, String password) {
        System.out.println("Validando mediante Usuario y Contraseña...");

        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            System.out.println("Error: Usuario o contraseña vacíos.");
            return false;
        }

        return true;
    }
}