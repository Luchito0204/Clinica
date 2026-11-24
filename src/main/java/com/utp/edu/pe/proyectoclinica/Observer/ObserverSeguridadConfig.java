package com.utp.edu.pe.proyectoclinica.Observer;

import com.utp.edu.pe.proyectoclinica.Singleton.ConfiguracionSeguridadSingleton;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

/**
 * Registra una sola vez, al iniciar la aplicacion, los observadores en el
 * LoginSubject que vive dentro del Singleton.
 */
@Component
public class ObserverSeguridadConfig {

    private final RegistroIntentosObserver registroIntentosObserver;

    public ObserverSeguridadConfig(RegistroIntentosObserver registroIntentosObserver) {
        this.registroIntentosObserver = registroIntentosObserver;
    }

    @PostConstruct
    public void registrarObservadores() {
        LoginSubject subject = ConfiguracionSeguridadSingleton.getInstancia().getLoginSubject();
        subject.agregarObservador(new AlertaSeguridadObserver());
        subject.agregarObservador(registroIntentosObserver);
    }
}
