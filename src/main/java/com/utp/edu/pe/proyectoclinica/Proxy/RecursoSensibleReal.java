package com.utp.edu.pe.proyectoclinica.Proxy;

import com.utp.edu.pe.proyectoclinica.Factory.Documentos.HistorialMedico;
import com.utp.edu.pe.proyectoclinica.repository.HistorialMedicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RecursoSensibleReal implements RecursoSensibleService{
    @Autowired
    HistorialMedicoRepository historialRepository;
    @Override
    public HistorialMedico accederAlRecurso(String token, Long id) {
        System.out.println("Acceso concedido a los datos altamente sensibles del sistema..");
        return historialRepository.findById(id).orElse(null);
    }

    public List<HistorialMedico> buscarPorNombrePaciente(String token, String nombre) {
        System.out.println("Buscando historiales para el paciente: " + nombre);
        return historialRepository.findbyPacienteNombreContaining(nombre);
    }
}