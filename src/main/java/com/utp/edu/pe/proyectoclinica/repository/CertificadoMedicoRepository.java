package com.utp.edu.pe.proyectoclinica.repository;
import com.utp.edu.pe.proyectoclinica.Factory.Documentos.CertificadoMedico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificadoMedicoRepository  extends JpaRepository<CertificadoMedico, Long> {
}
