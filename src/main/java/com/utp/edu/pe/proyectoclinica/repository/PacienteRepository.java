package com.utp.edu.pe.proyectoclinica.repository;
import com.utp.edu.pe.proyectoclinica.model.Paciente;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long>{
    @Query("SELECT p FROM Paciente p WHERE p.nombres LIKE %:filtro% OR p.dni LIKE %:filtro%")
    List<Paciente> buscarPorNombreODni(@Param("filtro") String filtro);

    boolean existsByDni(String dni);
}
