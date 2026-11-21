package com.utp.edu.pe.proyectoclinica.controller.Documento;
import com.utp.edu.pe.proyectoclinica.Factory.Documentos.CertificadoMedico;
import com.utp.edu.pe.proyectoclinica.dto.CertificadoRequestDTO;
import com.utp.edu.pe.proyectoclinica.model.Medico;
import com.utp.edu.pe.proyectoclinica.model.Paciente;
import com.utp.edu.pe.proyectoclinica.repository.CertificadoMedicoRepository;
import com.utp.edu.pe.proyectoclinica.repository.MedicoRepository;
import com.utp.edu.pe.proyectoclinica.repository.PacienteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificados")
public class CertificadoMedicoController {

    private final CertificadoMedicoRepository certificadoMedicoRepository;
    private final PacienteRepository pacienteRepository;
    private final MedicoRepository medicoRepository;

    public CertificadoMedicoController(CertificadoMedicoRepository certificadoMedicoRepository, PacienteRepository pacienteRepository, MedicoRepository medicoRepository) {
        this.certificadoMedicoRepository = certificadoMedicoRepository;
        this.pacienteRepository = pacienteRepository;
        this.medicoRepository = medicoRepository;
    }

    @PostMapping
    public ResponseEntity<?> resgistrarCertificado(@RequestBody CertificadoRequestDTO certificadoRequestDTO){
        Paciente paciente = pacienteRepository.findById(certificadoRequestDTO.getPacienteId()).orElseThrow(()-> new RuntimeException("Paciente no encontrado"));

        Medico medico = medicoRepository.findById(certificadoRequestDTO.getMedicoId()).orElseThrow(()->new RuntimeException("Medico no encontrado"));

        CertificadoMedico certificadoMedico = new CertificadoMedico();
        certificadoMedico.setPaciente(paciente);
        certificadoMedico.setMedico(medico);
        certificadoMedico.setDiagnostico(certificadoRequestDTO.getDiagnostico());
        certificadoMedico.setFechaEmicion(certificadoRequestDTO.getFechaEmicion());

        CertificadoMedico guardado = certificadoMedicoRepository.save(certificadoMedico);

        return ResponseEntity.ok(guardado);
    }
}
