package com.utp.edu.pe.proyectoclinica.ChainOfResponsability;

public class AutorizacionHandler extends FiltroSeguridadHandler {

    @Override
    public boolean validar(String token, String rol, String recurso) {
        System.out.println("Segundo Filtro. Validando autorizacion para el rol: " + rol);

        if (rol == null || rol.isBlank()) {
            System.out.println("Error: Rol no proporcionado para acceder a " + recurso);
            return false;
        }

        String rolNormalizado = rol.trim().toUpperCase();
        String recursoSeguro = recurso != null ? recurso.trim() : "";

        boolean esRolAdminOMedico = rolNormalizado.equals("ADMIN")
                || rolNormalizado.equals("ADMINISTRADOR")
                || rolNormalizado.equals("MEDICO");

        boolean esRolUsuario = rolNormalizado.equals("USUARIO")
                || rolNormalizado.equals("USER")
                || rolNormalizado.equals("PACIENTE");

        boolean accesoLoginPermitido = recursoSeguro.equals("/api/sesion/login")
                && (esRolAdminOMedico || esRolUsuario);

        boolean accesoPortalUsuarioPermitido = esRolUsuario && (
                recursoSeguro.startsWith("/api/agendar-cita")
                        || recursoSeguro.startsWith("/api/recetas")
                        || recursoSeguro.startsWith("/api/certificados")
                        || recursoSeguro.startsWith("/api/medicos")
                        || recursoSeguro.startsWith("/api/pacientes")
        );

        boolean rolPermitido = esRolAdminOMedico || accesoLoginPermitido || accesoPortalUsuarioPermitido;

        if (!rolPermitido) {
            System.out.println("Error: Rol '" + rol + "' no autorizado para acceder a " + recurso);
            return false;
        }

        if (siguiente != null) {
            return siguiente.validar(token, rolNormalizado, recursoSeguro);
        }

        return true;
    }
}