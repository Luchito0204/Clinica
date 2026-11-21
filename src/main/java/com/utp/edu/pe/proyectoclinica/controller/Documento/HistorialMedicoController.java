package com.utp.edu.pe.proyectoclinica.controller.Documento;
import com.utp.edu.pe.proyectoclinica.Factory.Documentos.CertificadoMedico;
import com.utp.edu.pe.proyectoclinica.Proxy.RecursoSensibleService;
import com.utp.edu.pe.proyectoclinica.dto.HistorialRequestDTO;
import com.utp.edu.pe.proyectoclinica.repository.CertificadoMedicoRepository;
import org.springframework.web.bind.annotation.*;
import com.utp.edu.pe.proyectoclinica.repository.PacienteRepository;
import com.utp.edu.pe.proyectoclinica.repository.HistorialMedicoRepository;
import com.utp.edu.pe.proyectoclinica.repository.MedicoRepository;
import com.utp.edu.pe.proyectoclinica.Factory.Documentos.HistorialMedico;
import com.utp.edu.pe.proyectoclinica.model.Paciente;
import com.utp.edu.pe.proyectoclinica.model.Medico;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("api/historiales")
public class HistorialMedicoController {

    private final RecursoSensibleService recursoSensibleService;
    private final HistorialMedicoRepository historialMedicoRepository;
    private final PacienteRepository pacienteRepository;
    private final MedicoRepository medicoRepository;
    private final CertificadoMedicoRepository certificadoMedicoRepository;

    public HistorialMedicoController(CertificadoMedicoRepository certificadoMedicoRepository, RecursoSensibleService recursoSensibleService, HistorialMedicoRepository historialMedicoRepository, PacienteRepository pacienteRepository, MedicoRepository medicoRepository) {
        this.recursoSensibleService = recursoSensibleService;
        this.historialMedicoRepository = historialMedicoRepository;
        this.pacienteRepository = pacienteRepository;
        this.medicoRepository = medicoRepository;
        this.certificadoMedicoRepository = certificadoMedicoRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerHistorialSensible(@RequestHeader("Authorization") String token, @PathVariable  Long id){
        try{
            Object resultado = recursoSensibleService.accederAlRecurso(token, id);
            return ResponseEntity.ok(resultado);
        } catch (Exception e){
            return ResponseEntity.status(403).body("Acceso denegado: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> registrarHistorial(@RequestBody HistorialRequestDTO requestDTO){
        Paciente paciente = pacienteRepository.findById(requestDTO.getPacienteId()).orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        Medico medico = medicoRepository.findById(requestDTO.getMedicoId()).orElseThrow(() -> new RuntimeException("Medico no encontrado"));

        CertificadoMedico certificadoMedico = certificadoMedicoRepository.findById(requestDTO.getCertificadoId()).orElseThrow(() -> new RuntimeException("Certificado no encontrado"));

        HistorialMedico historialMedico = new HistorialMedico();
        historialMedico.setPaciente(paciente);
        historialMedico.setMedico(medico);
        historialMedico.setCertificadoMedico(certificadoMedico);
        historialMedico.setFechaConsulta(requestDTO.getFechaConsulta());

        HistorialMedico historialGuardada = historialMedicoRepository.save(historialMedico);

        return ResponseEntity.ok(historialGuardada);
    }

}
