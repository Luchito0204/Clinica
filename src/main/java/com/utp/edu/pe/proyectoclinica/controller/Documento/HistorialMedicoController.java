package com.utp.edu.pe.proyectoclinica.controller.Documento;

import com.utp.edu.pe.proyectoclinica.ChainOfResponsability.SeguridadChainClient;
import com.utp.edu.pe.proyectoclinica.Factory.Documentos.CertificadoMedico;
import com.utp.edu.pe.proyectoclinica.Factory.Documentos.HistorialMedico;
import com.utp.edu.pe.proyectoclinica.Proxy.RecursoSensibleService;
import com.utp.edu.pe.proyectoclinica.Strategy.Autenticacion.AuthTokenStrategy;
import com.utp.edu.pe.proyectoclinica.Strategy.Autenticacion.AutenticacionStrategy;
import com.utp.edu.pe.proyectoclinica.dto.HistorialRequestDTO;
import com.utp.edu.pe.proyectoclinica.model.Medico;
import com.utp.edu.pe.proyectoclinica.model.Paciente;
import com.utp.edu.pe.proyectoclinica.repository.CertificadoMedicoRepository;
import com.utp.edu.pe.proyectoclinica.repository.HistorialMedicoRepository;
import com.utp.edu.pe.proyectoclinica.repository.MedicoRepository;
import com.utp.edu.pe.proyectoclinica.repository.PacienteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/historiales")
@CrossOrigin(origins = "*")
public class HistorialMedicoController {

    private final RecursoSensibleService recursoSensibleService;
    private final HistorialMedicoRepository historialMedicoRepository;
    private final PacienteRepository pacienteRepository;
    private final MedicoRepository medicoRepository;
    private final CertificadoMedicoRepository certificadoMedicoRepository;

    public HistorialMedicoController(
            CertificadoMedicoRepository certificadoMedicoRepository,
            RecursoSensibleService recursoSensibleService,
            HistorialMedicoRepository historialMedicoRepository,
            PacienteRepository pacienteRepository,
            MedicoRepository medicoRepository) {
        this.recursoSensibleService = recursoSensibleService;
        this.historialMedicoRepository = historialMedicoRepository;
        this.pacienteRepository = pacienteRepository;
        this.medicoRepository = medicoRepository;
        this.certificadoMedicoRepository = certificadoMedicoRepository;
    }

    private String extraerRolDesdeToken(String token) {
        if (token == null) return "DESCONOCIDO";
        String upper = token.toUpperCase();
        if (upper.contains("ADMIN")) return "ADMIN";
        if (upper.contains("MEDICO")) return "MEDICO";
        return "USUARIO";
    }

    private boolean validarTokenYCadena(String token, String recurso) {
        AutenticacionStrategy tokenStrategy = new AuthTokenStrategy();
        if (!tokenStrategy.autenticar(token, null)) {
            return false;
        }
        String rol = extraerRolDesdeToken(token);
        return SeguridadChainClient.ejecutarCadena(token.trim(), rol, recurso);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerHistorialSensible(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id) {
        AutenticacionStrategy tokenStrategy = new AuthTokenStrategy();
        if (!tokenStrategy.autenticar(token, null)) {
            return ResponseEntity.status(401).body(Map.of("error", "Token inválido o ausente"));
        }

        try {
            HistorialMedico resultado = recursoSensibleService.accederAlRecurso(token.trim(), id);
            if (resultado == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Historial médico no encontrado"));
            }
            return ResponseEntity.ok(resultado);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("error", "Acceso denegado: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener historial: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> listarHistoriales(
            @RequestHeader(value = "Authorization", required = false) String token) {
        if (!validarTokenYCadena(token, "/api/historiales")) {
            return ResponseEntity.status(403).body(Map.of("error", "Acceso denegado para listar historiales"));
        }
        return ResponseEntity.ok(historialMedicoRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> registrarHistorial(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody HistorialRequestDTO requestDTO) {
        if (!validarTokenYCadena(token, "POST /api/historiales")) {
            return ResponseEntity.status(403).body(Map.of("error", "Acceso denegado para registrar historial"));
        }

        Paciente paciente = pacienteRepository.findById(requestDTO.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        Medico medico = medicoRepository.findById(requestDTO.getMedicoId())
                .orElseThrow(() -> new RuntimeException("Medico no encontrado"));
        CertificadoMedico certificadoMedico = certificadoMedicoRepository.findById(requestDTO.getCertificadoId())
                .orElseThrow(() -> new RuntimeException("Certificado no encontrado"));

        HistorialMedico historialMedico = new HistorialMedico();
        historialMedico.setPaciente(paciente);
        historialMedico.setMedico(medico);
        historialMedico.setCertificadoMedico(certificadoMedico);
        historialMedico.setFechaConsulta(requestDTO.getFechaConsulta());

        HistorialMedico historialGuardada = historialMedicoRepository.save(historialMedico);
        return ResponseEntity.ok(historialGuardada);
    }
}