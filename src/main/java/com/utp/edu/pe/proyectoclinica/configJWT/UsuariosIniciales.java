package com.utp.edu.pe.proyectoclinica.configJWT;

import com.utp.edu.pe.proyectoclinica.model.Usuario;
import com.utp.edu.pe.proyectoclinica.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Crea en la tabla usuarios las cuentas de Recepcion y Botica si todavia no existen.
 * No toca ni sobrescribe usuarios que ya estan en la base de datos.
 * IMPORTANTE: cambia estas contrasenas antes de presentar/desplegar el proyecto.
 */
@Component
public class UsuariosIniciales implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;

    public UsuariosIniciales(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void run(String... args) {
        crearSiNoExiste("Recepcion", "recepcion123", "RECEPCION");
        crearSiNoExiste("Botica", "adjadka", "BOTICA");
    }

    private void crearSiNoExiste(String username, String password, String rol) {
        if (usuarioRepository.findByUsername(username).isEmpty()) {
            usuarioRepository.save(new Usuario(null, username, password, rol, 0));
            System.out.println("Usuario inicial creado: " + username + " (rol " + rol + ")");
        }
    }
}
