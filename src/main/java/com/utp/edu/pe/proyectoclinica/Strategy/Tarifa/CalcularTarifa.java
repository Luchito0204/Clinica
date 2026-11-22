package com.utp.edu.pe.proyectoclinica.Strategy.Tarifa;
import org.springframework.stereotype.Component;

@Component
public class CalcularTarifa{
 private TarifaConsultaStrategy strategy;

 public void setStrategy(TarifaConsultaStrategy strategy){
     this.strategy = strategy;
 }

 public double calcular(double montoBase){
     if(strategy == null){
         throw new IllegalStateException("Error 404");
     }
     return strategy.calcularTarifa(montoBase);
 }
}
