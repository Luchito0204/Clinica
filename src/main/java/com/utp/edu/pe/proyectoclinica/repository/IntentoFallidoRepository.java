package com.utp.edu.pe.proyectoclinica.repository;
import com.utp.edu.pe.proyectoclinica.model.IntentoFallido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IntentoFallidoRepository extends JpaRepository<IntentoFallido, Long> {
    List<IntentoFallido> findTop100ByOrderByIdDesc();
}
