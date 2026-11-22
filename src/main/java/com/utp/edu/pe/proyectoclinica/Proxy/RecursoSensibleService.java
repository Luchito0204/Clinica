package com.utp.edu.pe.proyectoclinica.Proxy;

import com.utp.edu.pe.proyectoclinica.Factory.Documentos.HistorialMedico;

import java.util.List;

public interface RecursoSensibleService {
    HistorialMedico accederAlRecurso(String token, Long id);
}
