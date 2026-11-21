package com.utp.edu.pe.proyectoclinica.controller.ModelController;
import org.springframework.web.bind.annotation.*;
import com.utp.edu.pe.proyectoclinica.repository.AgendarCitaRepository;
import com.utp.edu.pe.proyectoclinica.model.AgendarCita;

import java.util.List;

@RequestMapping("/api/agendar-cita")
@RestController
public class AgendarCitaController {
    private final AgendarCitaRepository agendarCitaRepository;

    public AgendarCitaController (AgendarCitaRepository agendarCitaRepository){
        this.agendarCitaRepository = agendarCitaRepository;
    }

    @GetMapping
    public List<AgendarCita> listarCitas(){
        return agendarCitaRepository.findAll();
    }

    @PostMapping
    public AgendarCita registrarCita(@RequestBody AgendarCita agendarCita){
        return agendarCitaRepository.save(agendarCita);
    }

}
