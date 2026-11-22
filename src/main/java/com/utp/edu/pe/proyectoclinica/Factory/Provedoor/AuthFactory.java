package com.utp.edu.pe.proyectoclinica.Factory.Provedoor;

public class AuthFactory {
    public static ProveedorAutenticacion obtenerProveedor(String tipo){
        if(tipo.equalsIgnoreCase("INTERNO")){
            return new ProvedorInterno();
        } else if (tipo.equalsIgnoreCase("EXTERNO")){
            return new ProvedorExterno();
        }
        throw new IllegalArgumentException("Tipo de proveedor de autenticacion no valido...");
    }
}
