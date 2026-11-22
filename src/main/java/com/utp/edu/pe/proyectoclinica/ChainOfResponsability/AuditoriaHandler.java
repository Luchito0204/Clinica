package com.utp.edu.pe.proyectoclinica.ChainOfResponsability;

public class AuditoriaHandler extends FiltroSeguridadHandler{
    @Override
    public boolean validar(String token, String rol, String recurso) {
        System.out.println("Tercer Filtro. Registrando en la base de datos de auditoria...");

        if(siguiente!=null){
            return siguiente.validar(token,rol,recurso);
        }
        return true;
    }
}
