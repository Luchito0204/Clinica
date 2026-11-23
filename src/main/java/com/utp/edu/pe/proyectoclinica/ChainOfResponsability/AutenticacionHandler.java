package com.utp.edu.pe.proyectoclinica.ChainOfResponsability;

public class AutenticacionHandler extends FiltroSeguridadHandler {

    @Override
    public boolean validar(String token, String rol, String recurso) {
        System.out.println("Primer Filtro. Validando autenticacion del token...");

        if (token == null || token.isBlank()) {
            System.out.println("Error: Token no proporcionado o vacio.");
            return false;
        }

        String tokenLimpio = token.trim();
        if (!tokenLimpio.startsWith("Bearer-") && !tokenLimpio.startsWith("Bearer ")) {
            System.out.println("Error: Formato de token invalido.");
            return false;
        }

        if (siguiente != null) {
            return siguiente.validar(tokenLimpio, rol, recurso);
        }

        return true;
    }
}