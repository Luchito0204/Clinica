package com.utp.edu.pe.proyectoclinica.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.utp.edu.pe.proyectoclinica.model.Medico;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicoRepository  extends  JpaRepository<Medico, Long>{
}
