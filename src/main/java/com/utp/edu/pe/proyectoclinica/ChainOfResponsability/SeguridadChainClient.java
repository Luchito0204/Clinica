package com.utp.edu.pe.proyectoclinica.ChainOfResponsability;

public class SeguridadChainClient {
    public static boolean ejecutarCadena(String token, String rol, String recurso){
        FiltroSeguridadHandler autenticacion = new AutenticacionHandler();
        FiltroSeguridadHandler autorizacion = new AutorizacionHandler();
        FiltroSeguridadHandler auditoria = new AuditoriaHandler();

        autenticacion.setSiguiente(autorizacion);
        autorizacion.setSiguiente(auditoria);

        return autenticacion.validar(token, rol, recurso);
    }
}
