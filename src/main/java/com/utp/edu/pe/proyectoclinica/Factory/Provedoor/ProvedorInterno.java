package com.utp.edu.pe.proyectoclinica.Factory.Provedoor;

public class ProvedorInterno implements ProveedorAutenticacion {
    @Override
    public void procesarAutenticacion(){
        System.out.println("Autenticando mediante la base de datos interna...");
    }
}
