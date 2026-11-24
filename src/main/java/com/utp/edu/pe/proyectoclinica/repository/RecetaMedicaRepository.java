package com.utp.edu.pe.proyectoclinica.repository;
import com.utp.edu.pe.proyectoclinica.Factory.Documentos.RecetaMedica;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface RecetaMedicaRepository extends JpaRepository<RecetaMedica, Long>{

    @Query("SELECT r FROM RecetaMedica r WHERE LOWER(CONCAT(r.paciente.nombres, ' ', r.paciente.apellidos)) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<RecetaMedica> buscarPorNombrePaciente(@Param("nombre") String nombre);
}
