package com.utp.edu.pe.proyectoclinica.Strategy.Autenticacion;

public class AuthTokenStrategy implements AutenticacionStrategy{
    @Override
    public boolean autenticar(String token, String extra){
        System.out.println("Validando mediante Token Externo y/o API key...");
     return true;
    }
}
