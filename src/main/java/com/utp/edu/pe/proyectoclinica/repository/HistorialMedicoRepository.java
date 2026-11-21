package com.utp.edu.pe.proyectoclinica.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.utp.edu.pe.proyectoclinica.Factory.Documentos.HistorialMedico;

import java.util.List;

@Repository
public interface HistorialMedicoRepository extends JpaRepository<HistorialMedico, Long>{
    @Query("SELECT h FROM HistorialMedico h WHERE h.paciente.Nombres LIKE %:nombre%")
    List<HistorialMedico> findbyPacienteNombreContaining(@Param("nombre") String nombre);
}
