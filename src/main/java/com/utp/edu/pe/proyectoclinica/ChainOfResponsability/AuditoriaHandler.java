package com.utp.edu.pe.proyectoclinica.ChainOfResponsability;

import java.time.LocalDateTime;

public class AuditoriaHandler extends FiltroSeguridadHandler {

    @Override
    public boolean validar(String token, String rol, String recurso) {
        String resumenToken = resumirToken(token);
        System.out.println("Tercer Filtro. [" + LocalDateTime.now() + "] Auditoria -> "
                + "Rol: " + rol + " | Recurso: " + recurso + " | Token: " + resumenToken);

        if (siguiente != null) {
            return siguiente.validar(token, rol, recurso);
        }

        return true;
    }

    private String resumirToken(String token) {
        if (token == null || token.isBlank()) {
            return "SIN_TOKEN";
        }
        String limpio = token.trim();
        return limpio.length() <= 14 ? limpio : limpio.substring(0, 14) + "...";
    }
}