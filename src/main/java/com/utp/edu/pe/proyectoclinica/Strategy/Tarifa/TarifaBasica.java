package com.utp.edu.pe.proyectoclinica.Strategy.Tarifa;
import org.springframework.stereotype.Component;

@Component("Basica")
public class TarifaBasica implements TarifaConsultaStrategy{
    @Override
    public double calcularTarifa(double montoBase){
        return montoBase;
    }
}
