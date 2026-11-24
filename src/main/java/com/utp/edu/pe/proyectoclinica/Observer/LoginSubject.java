package com.utp.edu.pe.proyectoclinica.Observer;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class LoginSubject {
   // Lista segura para varios hilos: el Singleton la comparte entre todas las peticiones.
   private final List<ObserverSeguridad> observadores = new CopyOnWriteArrayList<>();

   public void agregarObservador(ObserverSeguridad observador){
       if (observador != null && !observadores.contains(observador)) {
           observadores.add(observador);
       }
   }

   public void notificarObservadores(String alerta){
       for (ObserverSeguridad observer: observadores){
           try {
               observer.actualizar(alerta);
           } catch (Exception e) {
               System.out.println("Observer fallo al notificar: " + e.getMessage());
           }
       }
   }

   public void registrarIntentoFallido(String usuario){
       registrarIntentoFallido(usuario, "CREDENCIALES_INVALIDAS");
   }

   public void registrarIntentoFallido(String usuario, String motivo){
       String nombre = (usuario == null || usuario.isBlank()) ? "DESCONOCIDO" : usuario.trim();

       notificarObservadores("Intento de acceso fallido para el usuario: " + nombre + " (" + motivo + ")");

       for (ObserverSeguridad observer: observadores){
           try {
               observer.intentoFallido(nombre, motivo);
           } catch (Exception e) {
               System.out.println("Observer fallo al registrar el intento: " + e.getMessage());
           }
       }
   }
}
