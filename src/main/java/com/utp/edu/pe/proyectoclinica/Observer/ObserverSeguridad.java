package com.utp.edu.pe.proyectoclinica.Observer;

public interface ObserverSeguridad {
    void actualizar(String mensajeAlerta);

    // Evento estructurado de intento fallido (por defecto no hace nada,
    // asi los observadores que solo muestran alertas no tienen que implementarlo).
    default void intentoFallido(String username, String motivo) {
    }
}
