package com.utp.edu.pe.proyectoclinica.controller.Tarifa;
import com.utp.edu.pe.proyectoclinica.Strategy.Tarifa.*;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;

@RestController
@RequestMapping
@CrossOrigin(origins = "*")
public class TarifaController {

    private CalcularTarifa calcularTarifa;
    private final TarifaParticular tarifaParticular;
    private final TarifaConvenioUTP tarifaConvenioUTP;
    private final TarifaBasica tarifaBasica;

    public TarifaController(TarifaParticular tarifaParticular, TarifaConvenioUTP tarifaConvenioUTP, TarifaBasica tarifaBasica, CalcularTarifa calcularTarifa) {
        this.tarifaParticular = tarifaParticular;
        this.tarifaConvenioUTP = tarifaConvenioUTP;
        this.tarifaBasica = tarifaBasica;
        this.calcularTarifa = calcularTarifa;
    }

    @GetMapping("/calcular")
    public String calcularTarifa(@RequestParam String tipoPaciente, @RequestParam double montoBase){
        if(tipoPaciente.equalsIgnoreCase("particular")){
            calcularTarifa.setStrategy(tarifaParticular);
        } else if (tipoPaciente.equalsIgnoreCase("utp")){
            calcularTarifa.setStrategy(tarifaConvenioUTP);
        } else {
            calcularTarifa.setStrategy(tarifaBasica);
        }
        double total = calcularTarifa.calcular(montoBase);
        return "Tarifa calculada para el paciente: [" + tipoPaciente.toUpperCase()+ "]: S/ " +  total + " (Monto inicial: S/ " + montoBase + ")";
    }
}
