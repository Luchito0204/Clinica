package com.utp.edu.pe.proyectoclinica.repository;
import com.utp.edu.pe.proyectoclinica.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
 Optional<Usuario> findByUsername(String username);

 @Modifying(clearAutomatically = true, flushAutomatically = true)
 @Transactional
 @Query(value = "UPDATE usuarios SET intentos_fallidos = intentos_fallidos + 1 WHERE username = :username", nativeQuery = true)
 void incrementarIntentosFallidosNativo(@Param("username") String username);

 @Modifying(clearAutomatically = true, flushAutomatically = true)
 @Transactional
 @Query(value = "UPDATE usuarios SET intentos_fallidos = 0 WHERE username = :username", nativeQuery = true)
 void resetearIntentosFallidosNativo(@Param("username") String username);
}
