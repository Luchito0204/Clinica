package com.utp.edu.pe.proyectoclinica.controller.ModelController;

import com.utp.edu.pe.proyectoclinica.Factory.Documentos.RecetaMedica;
import com.utp.edu.pe.proyectoclinica.configJWT.TokenUtil;
import com.utp.edu.pe.proyectoclinica.dto.MedicamentoStockDTO;
import com.utp.edu.pe.proyectoclinica.dto.RecetaBoticaDTO;
import com.utp.edu.pe.proyectoclinica.model.Medicamento;
import com.utp.edu.pe.proyectoclinica.model.Medico;
import com.utp.edu.pe.proyectoclinica.model.Paciente;
import com.utp.edu.pe.proyectoclinica.repository.MedicamentoRepository;
import com.utp.edu.pe.proyectoclinica.repository.RecetaMedicaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Endpoints de SOLO LECTURA para el panel de Botica.
 * Exigen un token cuyo rol sea BOTICA (o ADMIN) y pasan por la cadena de seguridad.
 */
@RestController
@RequestMapping("/api/botica")
@CrossOrigin(origins = "*")
public class BoticaController {

    private static final String[] ROLES_PERMITIDOS = {"BOTICA", "ADMIN", "ADMINISTRADOR"};

    private final RecetaMedicaRepository recetaRepository;
    private final MedicamentoRepository medicamentoRepository;

    public BoticaController(RecetaMedicaRepository recetaRepository,
                            MedicamentoRepository medicamentoRepository) {
        this.recetaRepository = recetaRepository;
        this.medicamentoRepository = medicamentoRepository;
    }

    @GetMapping("/recetas")
    public ResponseEntity<?> listarRecetas(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestParam(required = false) String paciente) {

        int estado = TokenUtil.validarAcceso(token, "/api/botica/recetas", ROLES_PERMITIDOS);
        if (estado != 200) {
            return ResponseEntity.status(estado).body(Map.of("error", TokenUtil.mensajeError(estado)));
        }

        List<RecetaMedica> recetas = (paciente == null || paciente.isBlank())
                ? recetaRepository.findAll()
                : recetaRepository.buscarPorNombrePaciente(paciente.trim());

        List<RecetaBoticaDTO> respuesta = recetas.stream().map(this::aDto).toList();
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/medicamentos")
    public ResponseEntity<?> listarMedicamentos(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestParam(required = false) String nombre) {

        int estado = TokenUtil.validarAcceso(token, "/api/botica/medicamentos", ROLES_PERMITIDOS);
        if (estado != 200) {
            return ResponseEntity.status(estado).body(Map.of("error", TokenUtil.mensajeError(estado)));
        }

        List<Medicamento> medicamentos = (nombre == null || nombre.isBlank())
                ? medicamentoRepository.findAll()
                : medicamentoRepository.findByNombreMedicamentoContainingIgnoreCase(nombre.trim());

        List<MedicamentoStockDTO> respuesta = medicamentos.stream()
                .map(m -> new MedicamentoStockDTO(m.getId(), m.getNombreMedicamento(), m.getMg(), m.getStock()))
                .toList();
        return ResponseEntity.ok(respuesta);
    }

    private RecetaBoticaDTO aDto(RecetaMedica receta) {
        Paciente p = receta.getPaciente();
        Medico m = receta.getMedico();
        Medicamento med = receta.getMedicamento();

        String nombrePaciente = p == null ? "—" : (nvl(p.getNombres()) + " " + nvl(p.getApellidos())).trim();
        String nombreMedico = m == null ? "—" : (nvl(m.getNombre()) + " " + nvl(m.getApellido())).trim();

        return new RecetaBoticaDTO(
                receta.getId(),
                nombrePaciente,
                nombreMedico,
                med == null ? "—" : med.getNombreMedicamento(),
                med == null ? 0 : med.getMg(),
                receta.getIndicaciones()
        );
    }

    private String nvl(String texto) {
        return texto == null ? "" : texto;
    }
}
