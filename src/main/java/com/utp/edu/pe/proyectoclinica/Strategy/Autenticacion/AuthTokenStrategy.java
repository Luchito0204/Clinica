package com.utp.edu.pe.proyectoclinica.Strategy.Autenticacion;

import org.springframework.stereotype.Component;

@Component("tokenStrategy")
public class AuthTokenStrategy implements AutenticacionStrategy {

    @Override
    public boolean autenticar(String token, String extra) {
        System.out.println("Validando mediante Token Externo y/o API key...");

        if (token == null || token.isBlank()) {
            System.out.println("Error: Token no proporcionado.");
            return false;
        }

        String tokenLimpio = token.trim();
        boolean formatoValido = (tokenLimpio.startsWith("Bearer-") || tokenLimpio.startsWith("Bearer "))
                && tokenLimpio.length() > 10;

        if (!formatoValido) {
            System.out.println("Error: Formato de token inválido.");
            return false;
        }

        return true;
    }
}