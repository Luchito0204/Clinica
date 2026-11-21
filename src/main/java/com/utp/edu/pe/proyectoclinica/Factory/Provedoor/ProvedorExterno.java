package com.utp.edu.pe.proyectoclinica.Factory.Provedoor;

public class ProvedorExterno implements ProveedorAutenticacion {
    @Override
    public void procesarAutenticacion(){
        System.out.println("Autenticando mediante proveedor de identidad externo...");
    }
}
