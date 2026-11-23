package com.utp.edu.pe.proyectoclinica.Proxy;

import com.utp.edu.pe.proyectoclinica.Factory.Documentos.HistorialMedico;

public interface RecursoSensibleService {
    HistorialMedico accederAlRecurso(String token, Long id);
}