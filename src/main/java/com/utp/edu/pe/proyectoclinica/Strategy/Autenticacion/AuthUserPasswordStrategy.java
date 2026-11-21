package com.utp.edu.pe.proyectoclinica.Strategy.Autenticacion;

public class AuthUserPasswordStrategy implements AutenticacionStrategy{
    @Override
    public boolean autenticar(String username, String password){
        System.out.println("Validando mediante Usuario y Contraseña..");
        return true;
    }
}
