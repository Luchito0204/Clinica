package com.utp.edu.pe.proyectoclinica.Singleton;

public class ConfiguracionSeguridadSingleton {
    private static ConfiguracionSeguridadSingleton instancia;

    private String jwSecret;
    private long jwtExpirationMs;
    private int maxIntentosFallidos;

    private ConfiguracionSeguridadSingleton(){
        this.jwSecret = "ClaveSecretaSuperSegura";
        this.jwtExpirationMs = 86400000;
        this.maxIntentosFallidos = 5;
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
}
