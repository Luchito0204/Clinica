package com.utp.edu.pe.proyectoclinica.controller.ModelController;

import com.utp.edu.pe.proyectoclinica.configJWT.TokenUtil;
import com.utp.edu.pe.proyectoclinica.model.Paciente;
import com.utp.edu.pe.proyectoclinica.repository.PacienteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeParseException;
import java.util.Map;

/**
 * Registro de pacientes para el panel de Recepcion.
 * Exige un token cuyo rol sea RECEPCION (o ADMIN) y valida los datos antes de insertar.
 */
@RestController
@RequestMapping("/api/recepcion")
@CrossOrigin(origins = "*")
public class RecepcionController {

    private static final String[] ROLES_PERMITIDOS = {"RECEPCION", "RECEPCIONISTA", "ADMIN", "ADMINISTRADOR"};

    private final PacienteRepository pacienteRepository;

    public RecepcionController(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    @PostMapping("/pacientes")
    public ResponseEntity<?> registrarPaciente(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody Paciente paciente) {

        int estado = TokenUtil.validarAcceso(token, "/api/recepcion/pacientes", ROLES_PERMITIDOS);
        if (estado != 200) {
            return ResponseEntity.status(estado).body(Map.of("error", TokenUtil.mensajeError(estado)));
        }

        String dni = paciente.getDni() == null ? "" : paciente.getDni().trim();
        if (!dni.matches("\\d{8}")) {
            return error(400, "El DNI debe tener exactamente 8 dígitos.");
        }
        if (esVacio(paciente.getNombres()) || esVacio(paciente.getApellidos())) {
            return error(400, "Los nombres y apellidos son obligatorios.");
        }
        if (esVacio(paciente.getEstadoCivil())) {
            return error(400, "El estado civil es obligatorio.");
        }
        if (esVacio(paciente.getFechaNacimiento())) {
            return error(400, "La fecha de nacimiento es obligatoria.");
        }

        LocalDate nacimiento;
        try {
            nacimiento = LocalDate.parse(paciente.getFechaNacimiento().trim());
        } catch (DateTimeParseException e) {
            return error(400, "La fecha de nacimiento no tiene un formato válido (aaaa-mm-dd).");
        }
        if (nacimiento.isAfter(LocalDate.now())) {
            return error(400, "La fecha de nacimiento no puede ser futura.");
        }

        if (pacienteRepository.existsByDni(dni)) {
            return error(409, "Ya existe un paciente registrado con el DNI " + dni + ".");
        }

        Paciente nuevo = new Paciente();
        nuevo.setDni(dni);
        nuevo.setNombres(paciente.getNombres().trim());
        nuevo.setApellidos(paciente.getApellidos().trim());
        nuevo.setFechaNacimiento(nacimiento.toString());
        nuevo.setEstadoCivil(paciente.getEstadoCivil().trim());
        nuevo.setEdad(Period.between(nacimiento, LocalDate.now()).getYears());
        nuevo.setTelefono(esVacio(paciente.getTelefono()) ? null : paciente.getTelefono().trim());
        nuevo.setCorreo(esVacio(paciente.getCorreo()) ? null : paciente.getCorreo().trim());

        return ResponseEntity.status(201).body(pacienteRepository.save(nuevo));
    }

    private boolean esVacio(String texto) {
        return texto == null || texto.isBlank();
    }

    private ResponseEntity<?> error(int estado, String mensaje) {
        return ResponseEntity.status(estado).body(Map.of("error", mensaje));
    }
}
