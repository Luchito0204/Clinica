package com.utp.edu.pe.proyectoclinica.Strategy.Tarifa;
import org.springframework.stereotype.Component;

@Component("ConvenioUTP")
public class TarifaConvenioUTP implements TarifaConsultaStrategy{
    @Override
    public double calcularTarifa(double montoBase){
        return montoBase;
    }
}
