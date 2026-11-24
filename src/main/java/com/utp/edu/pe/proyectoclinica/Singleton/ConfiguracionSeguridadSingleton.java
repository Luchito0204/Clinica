package com.utp.edu.pe.proyectoclinica.Singleton;

import com.utp.edu.pe.proyectoclinica.Observer.LoginSubject;

public class ConfiguracionSeguridadSingleton {
    private static ConfiguracionSeguridadSingleton instancia;

    private String jwSecret;
    private long jwtExpirationMs;
    private int maxIntentosFallidos;

    // Unico "sujeto" del patron Observer: todos los observadores se registran aqui
    // y el login siempre notifica a traves de esta misma instancia.
    private final LoginSubject loginSubject;

    private ConfiguracionSeguridadSingleton(){
        this.jwSecret = "ClaveSecretaSuperSegura";
        this.jwtExpirationMs = 86400000;
        this.maxIntentosFallidos = 5;
        this.loginSubject = new LoginSubject();
    }

    public static synchronized ConfiguracionSeguridadSingleton getInstancia(){
        if(instancia == null){
            instancia = new ConfiguracionSeguridadSingleton();
        }
        return instancia;
    }

    public String getJwSecret(){
        return jwSecret;
    }

    public long getJwtExpirationMs(){
        return jwtExpirationMs;
    }

    public int getMaxIntentosFallidos(){
        return maxIntentosFallidos;
    }

    public LoginSubject getLoginSubject(){
        return loginSubject;
    }
}
