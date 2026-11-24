package com.utp.edu.pe.proyectoclinica.configJWT;

import com.utp.edu.pe.proyectoclinica.ChainOfResponsability.SeguridadChainClient;
import com.utp.edu.pe.proyectoclinica.Strategy.Autenticacion.AuthTokenStrategy;

/**
 * Utilidades para leer el token que genera el login: Bearer-ROL-username-uuid
 * y validar que su rol pueda acceder a un recurso (Strategy + Chain of Responsibility).
 */
public final class TokenUtil {

    private TokenUtil() {
    }

    public static String extraerRol(String token) {
        if (token == null || token.isBlank()) {
            return "DESCONOCIDO";
        }

        String limpio = token.trim();
        if (limpio.startsWith("Bearer ")) {
            limpio = limpio.substring(7).trim();
        }
        if (limpio.startsWith("Bearer-")) {
            limpio = limpio.substring(7);
        }

        int separador = limpio.indexOf('-');
        String rol = separador > 0 ? limpio.substring(0, separador) : limpio;
        return rol.isBlank() ? "DESCONOCIDO" : rol.trim().toUpperCase();
    }

    /**
     * @return 200 si el acceso esta permitido, 401 si el token falta o es invalido,
     *         403 si el rol no esta permitido para el recurso.
     */
    public static int validarAcceso(String token, String recurso, String... rolesPermitidos) {
        if (!new AuthTokenStrategy().autenticar(token, null)) {
            return 401;
        }

        String rol = extraerRol(token);
        boolean rolPermitido = false;
        for (String permitido : rolesPermitidos) {
            if (permitido.equalsIgnoreCase(rol)) {
                rolPermitido = true;
                break;
            }
        }
        if (!rolPermitido) {
            return 403;
        }

        return SeguridadChainClient.ejecutarCadena(token.trim(), rol, recurso) ? 200 : 403;
    }

    public static String mensajeError(int estado) {
        return estado == 401
                ? "Token invalido o ausente"
                : "Tu rol no esta autorizado para este recurso";
    }
}
