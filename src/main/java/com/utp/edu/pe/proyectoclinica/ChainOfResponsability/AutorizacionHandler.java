package com.utp.edu.pe.proyectoclinica.ChainOfResponsability;

public class AutorizacionHandler extends FiltroSeguridadHandler{
    @Override
    public boolean validar(String token, String rol, String recurso){
        System.out.println("Segundo Filtro. Validando autorizacion para el rol: " + rol);
        if("Usuario".equals(rol)){
            System.out.println("Error: Rol no autorizado para acceder a " + recurso);
            return false;
        }
        if(siguiente!=null){
            return siguiente.validar(token,rol, recurso);
        }
        return true;
    }
}
