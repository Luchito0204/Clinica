package com.utp.edu.pe.proyectoclinica.controller.Documento;
import com.utp.edu.pe.proyectoclinica.Factory.Documentos.RecetaMedica;
import com.utp.edu.pe.proyectoclinica.dto.RecetaRequestDTO;
import com.utp.edu.pe.proyectoclinica.model.Medico;
import com.utp.edu.pe.proyectoclinica.model.Paciente;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.utp.edu.pe.proyectoclinica.repository.PacienteRepository;
import com.utp.edu.pe.proyectoclinica.repository.MedicamentoRepository;
import com.utp.edu.pe.proyectoclinica.repository.MedicoRepository;
import com.utp.edu.pe.proyectoclinica.repository.RecetaMedicaRepository;
import com.utp.edu.pe.proyectoclinica.model.Medicamento;
@RestController
@RequestMapping("/api/recetas")
public class RecetaMedicaController {

    private final RecetaMedicaRepository recetaRepository;
    private final PacienteRepository pacienteRepository;
    private final MedicoRepository medicoRepository;
    private final MedicamentoRepository medicamentoRepository;

    public RecetaMedicaController(RecetaMedicaRepository recetaRepository,
                                  PacienteRepository pacienteRepository,
                                  MedicoRepository medicoRepository,
                                  MedicamentoRepository medicamentoRepository) {
        this.recetaRepository = recetaRepository;
        this.pacienteRepository = pacienteRepository;
        this.medicoRepository = medicoRepository;
        this.medicamentoRepository = medicamentoRepository;
    }

    @PostMapping
    public ResponseEntity<?> registrarReceta(@RequestBody RecetaRequestDTO request) {
        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        Medico medico = medicoRepository.findById(request.getMedicoId())
                .orElseThrow(() -> new RuntimeException("Médico no encontrado"));

        Medicamento medicamento = medicamentoRepository.findById(request.getMedicamentoId())
                .orElseThrow(() -> new RuntimeException("Medicamento no encontrado"));

        RecetaMedica receta = new RecetaMedica();
        receta.setPaciente(paciente);
        receta.setMedico(medico);
        receta.setIndicaciones(request.getIndicaciones());
        receta.setMedicamento(medicamento);


        RecetaMedica recetaGuardada = recetaRepository.save(receta);

        return ResponseEntity.ok(recetaGuardada);
    }
}