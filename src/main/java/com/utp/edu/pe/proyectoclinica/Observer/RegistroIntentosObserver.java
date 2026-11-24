package com.utp.edu.pe.proyectoclinica.Observer;

import com.utp.edu.pe.proyectoclinica.Singleton.ConfiguracionSeguridadSingleton;
import com.utp.edu.pe.proyectoclinica.model.IntentoFallido;
import com.utp.edu.pe.proyectoclinica.repository.IntentoFallidoRepository;
import com.utp.edu.pe.proyectoclinica.repository.UsuarioRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Observador que PERSISTE cada intento fallido de login:
 *  - guarda un registro en la tabla intento_fallido (incluye usuarios que no existen)
 *  - suma 1 al contador usuarios.intentos_fallidos cuando el usuario existe
 *  - avisa cuando se alcanza el maximo definido en el Singleton
 */
@Component
public class RegistroIntentosObserver implements ObserverSeguridad {

    private final IntentoFallidoRepository intentoFallidoRepository;
    private final UsuarioRepository usuarioRepository;

    public RegistroIntentosObserver(IntentoFallidoRepository intentoFallidoRepository,
                                    UsuarioRepository usuarioRepository) {
        this.intentoFallidoRepository = intentoFallidoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void actualizar(String mensajeAlerta) {
        // La alerta en consola la muestra AlertaSeguridadObserver.
    }

    // REQUIRES_NEW: el registro se confirma aunque la transaccion del login termine distinta.
    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void intentoFallido(String username, String motivo) {
        intentoFallidoRepository.save(new IntentoFallido(username, motivo, LocalDateTime.now()));

        usuarioRepository.incrementarIntentosFallidosNativo(username);

        int maximo = ConfiguracionSeguridadSingleton.getInstancia().getMaxIntentosFallidos();
        usuarioRepository.findByUsername(username).ifPresent(usuario -> {
            if (usuario.getIntentosFallidos() >= maximo) {
                System.out.println("ALERTA DE SEGURIDAD: el usuario '" + username
                        + "' alcanzo " + usuario.getIntentosFallidos()
                        + " intentos fallidos (maximo configurado: " + maximo + ")");
            }
        });
    }
}
