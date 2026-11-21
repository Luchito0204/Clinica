package com.utp.edu.pe.proyectoclinica.ChainOfResponsability;

public class AutenticacionHandler extends FiltroSeguridadHandler {
    @Override
    public boolean validar(String token, String rol, String recurso){
        System.out.println("Primer Filtro. Validando autenticacion del token...");
        if(token == null || token.isEmpty()){
            System.out.println("Error: Token no proporcionado no es válido! ");
            return false;
        }
        if(siguiente != null){
            return siguiente.validar(token, rol, recurso);
        }
        return true;
    }
}
