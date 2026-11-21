package com.utp.edu.pe.proyectoclinica.repository;
import com.utp.edu.pe.proyectoclinica.model.AgendarCita;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface AgendarCitaRepository extends JpaRepository<AgendarCita, Long> {
}
