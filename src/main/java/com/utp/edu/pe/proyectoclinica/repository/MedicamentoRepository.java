package com.utp.edu.pe.proyectoclinica.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.utp.edu.pe.proyectoclinica.model.Medicamento;

import java.util.List;

@Repository
public interface MedicamentoRepository extends JpaRepository<Medicamento, Long> {
    List<Medicamento> findByNombreMedicamentoContainingIgnoreCase(String nombreMedicamento);
}
