package com.utp.edu.pe.proyectoclinica.Observer;
import java.util.ArrayList;
import java.util.List;

public class LoginSubject {
   private List<ObserverSeguridad> observadores = new ArrayList<>();

   public void agregarObservador(ObserverSeguridad observador){
       observadores.add(observador);
   }

   public void notificarObservadores(String alerta){
       for (ObserverSeguridad observer: observadores){
           observer.actualizar(alerta);
       }
   }

   public void registrarIntentoFallido(String usuario){
       notificarObservadores("Intento de acceso fallido para el usuario: " + usuario);
   }
}
