package com.utp.edu.pe.proyectoclinica.ChainOfResponsability;

public abstract class FiltroSeguridadHandler {
   protected FiltroSeguridadHandler siguiente;

   public void setSiguiente(FiltroSeguridadHandler siguiente){
       this.siguiente = siguiente;
   }

   public abstract boolean validar(String token, String rol, String recurso);
}
