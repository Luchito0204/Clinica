package com.utp.edu.pe.proyectoclinica.Proxy;

import com.utp.edu.pe.proyectoclinica.Factory.Documentos.HistorialMedico;
import com.utp.edu.pe.proyectoclinica.repository.HistorialMedicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class RecursoSensibleReal implements RecursoSensibleService {

    private final HistorialMedicoRepository historialRepository;

    @Autowired
    public RecursoSensibleReal(HistorialMedicoRepository historialRepository) {
        this.historialRepository = historialRepository;
    }

    @Override
    public HistorialMedico accederAlRecurso(String token, Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID de historial medico invalido.");
        }

        System.out.println("Acceso concedido a los datos altamente sensibles del sistema...");
        return historialRepository.findById(id).orElse(null);
    }

    public List<HistorialMedico> buscarPorNombrePaciente(String token, String nombre) {
        if (nombre == null || nombre.isBlank()) {
            return Collections.emptyList();
        }

        System.out.println("Buscando historiales para el paciente: " + nombre.trim());
        return historialRepository.findbyPacienteNombreContaining(nombre.trim());
    }
}