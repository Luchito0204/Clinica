package com.utp.edu.pe.proyectoclinica.controller.ModelController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.utp.edu.pe.proyectoclinica.model.Paciente;
import com.utp.edu.pe.proyectoclinica.repository.PacienteRepository;

import java.util.List;
@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {
    private final PacienteRepository pacienteRepository;

    public PacienteController(PacienteRepository pacienteRepository){
        this.pacienteRepository = pacienteRepository;
    }

    @GetMapping
    public List<Paciente> listarPacientes() {
        return pacienteRepository.findAll();
    }

    @PostMapping
    public Paciente registrarPaciente(@RequestBody Paciente paciente){
        return pacienteRepository.save(paciente);
    }

    @GetMapping("/buscar")
    public List<Paciente> buscarPaciente(@RequestParam String filtro){
        return pacienteRepository.buscarPorNombreODni(filtro);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paciente> actualizarPaciente(@PathVariable Long id, @RequestBody Paciente pacienteDetalles){
        return pacienteRepository.findById(id).map(paciente -> {
            paciente.setNombres(pacienteDetalles.getNombres());

            Paciente pacienteActualizado = pacienteRepository.save(paciente);
            return ResponseEntity.ok(pacienteActualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> eliminarPaciente(@PathVariable Long id){
        return pacienteRepository.findById(id).map(paciente -> {
            pacienteRepository.delete(paciente);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
