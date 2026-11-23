package com.utp.edu.pe.proyectoclinica.Strategy.Tarifa;

import org.springframework.stereotype.Component;

@Component("particular")
public class TarifaParticular implements TarifaConsultaStrategy {
    @Override
    public double calcularTarifa(double montoBase) {
        return montoBase * 0.50;
    }
}