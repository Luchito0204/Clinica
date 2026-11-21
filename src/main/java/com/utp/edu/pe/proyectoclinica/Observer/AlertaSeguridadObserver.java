package com.utp.edu.pe.proyectoclinica.Observer;

public class AlertaSeguridadObserver implements ObserverSeguridad{
    @Override
    public void actualizar(String mensajeAlerta){
        System.out.println("ALERTA DE SEGURIDAD: " + mensajeAlerta);

    }
}
