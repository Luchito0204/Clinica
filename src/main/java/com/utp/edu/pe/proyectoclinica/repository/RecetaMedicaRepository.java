package com.utp.edu.pe.proyectoclinica.repository;
import com.utp.edu.pe.proyectoclinica.Factory.Documentos.RecetaMedica;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface RecetaMedicaRepository extends JpaRepository<RecetaMedica, Long>{

}
