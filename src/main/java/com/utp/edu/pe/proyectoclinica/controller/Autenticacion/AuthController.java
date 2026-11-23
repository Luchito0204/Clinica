package com.utp.edu.pe.proyectoclinica.controller.Autenticacion;

import com.utp.edu.pe.proyectoclinica.ChainOfResponsability.SeguridadChainClient;
import com.utp.edu.pe.proyectoclinica.Factory.Provedoor.AuthFactory;
import com.utp.edu.pe.proyectoclinica.Factory.Provedoor.ProveedorAutenticacion;
import com.utp.edu.pe.proyectoclinica.Observer.AlertaSeguridadObserver;
import com.utp.edu.pe.proyectoclinica.Observer.LoginSubject;
import com.utp.edu.pe.proyectoclinica.Proxy.RecursoSensibleService;
import com.utp.edu.pe.proyectoclinica.Strategy.Autenticacion.AuthTokenStrategy;
import com.utp.edu.pe.proyectoclinica.Strategy.Autenticacion.AuthUserPasswordStrategy;
import com.utp.edu.pe.proyectoclinica.Strategy.Autenticacion.AutenticacionStrategy;
import com.utp.edu.pe.proyectoclinica.model.Usuario;
import com.utp.edu.pe.proyectoclinica.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final RecursoSensibleService recursoSensibleService;

    @Autowired
    public AuthController(UsuarioRepository usuarioRepository, RecursoSensibleService recursoSensibleService) {
        this.usuarioRepository = usuarioRepository;
        this.recursoSensibleService = recursoSensibleService;
    }

    @PostMapping("/login")
    @Transactional
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        String username = credenciales.get("username");
        String password = credenciales.get("password");
        String tipoProveedor = credenciales.getOrDefault("tipo", "INTERNO");

        ProveedorAutenticacion proveedor = AuthFactory.obtenerProveedor(tipoProveedor);
        proveedor.procesarAutenticacion();

        AutenticacionStrategy userPassStrategy = new AuthUserPasswordStrategy();
        boolean formatoValido = userPassStrategy.autenticar(username, password);

        Optional<Usuario> usuarioOpt = formatoValido
                ? usuarioRepository.findByUsername(username.trim())
                : Optional.empty();

        boolean credencialesValidas = usuarioOpt.isPresent()
                && usuarioOpt.get().getPassword().equals(password);

        if (!credencialesValidas) {
            if (usuarioOpt.isPresent()) {
                Usuario usuarioFallido = usuarioOpt.get();
                int intentosActuales = usuarioFallido.getIntentosFallidos();
                usuarioFallido.setIntentosFallidos(intentosActuales + 1);
                usuarioRepository.incrementarIntentosFallidosNativo(usuarioFallido.getUsername());
            }

            LoginSubject loginSubject = new LoginSubject();
            loginSubject.agregarObservador(new AlertaSeguridadObserver());
            loginSubject.registrarIntentoFallido(username != null ? username : "DESCONOCIDO");

            return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
        }

        Usuario usuario = usuarioOpt.get();
        usuario.setIntentosFallidos(0);
        usuarioRepository.resetearIntentosFallidosNativo(usuario.getUsername());

        String rolUsuario = usuario.getRol() != null ? usuario.getRol().trim().toUpperCase() : "USUARIO";
        String tokenGenerado = "Bearer-" + rolUsuario + "-"
                + usuario.getUsername() + "-" + UUID.randomUUID();

        boolean cadenaSuperada = SeguridadChainClient.ejecutarCadena(
                tokenGenerado,
                rolUsuario,
                "/api/sesion/login"
        );

        if (!cadenaSuperada) {
            return ResponseEntity.status(403).body(Map.of("error", "Acceso denegado por cadena de seguridad"));
        }

        return ResponseEntity.ok(Map.of(
                "mensaje", "Login exitoso",
                "token", tokenGenerado,
                "usuario", rolUsuario,
                "username", usuario.getUsername()
        ));
    }

    @GetMapping("/recurso-protegido/{id}")
    public ResponseEntity<?> accederRecurso(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id) {
        try {
            AutenticacionStrategy tokenStrategy = new AuthTokenStrategy();
            if (!tokenStrategy.autenticar(token, null)) {
                return ResponseEntity.status(401).body(Map.of("error", "Token inválido o ausente"));
            }

            Object datosSensibles = recursoSensibleService.accederAlRecurso(token.trim(), id);
            return ResponseEntity.ok(Map.of("datos", datosSensibles));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("error", "Acceso denegado por el proxy de seguridad: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al consultar el recurso: " + e.getMessage()));
        }
    }
}