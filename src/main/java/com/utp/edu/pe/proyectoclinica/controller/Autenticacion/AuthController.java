package com.utp.edu.pe.proyectoclinica.controller.Autenticacion;

import com.utp.edu.pe.proyectoclinica.ChainOfResponsability.SeguridadChainClient;
import com.utp.edu.pe.proyectoclinica.Factory.Provedoor.AuthFactory;
import com.utp.edu.pe.proyectoclinica.Factory.Provedoor.ProveedorAutenticacion;
import com.utp.edu.pe.proyectoclinica.Proxy.RecursoSensibleService;
import com.utp.edu.pe.proyectoclinica.Singleton.ConfiguracionSeguridadSingleton;
import com.utp.edu.pe.proyectoclinica.Strategy.Autenticacion.AuthTokenStrategy;
import com.utp.edu.pe.proyectoclinica.Strategy.Autenticacion.AuthUserPasswordStrategy;
import com.utp.edu.pe.proyectoclinica.Strategy.Autenticacion.AutenticacionStrategy;
import com.utp.edu.pe.proyectoclinica.configJWT.TokenUtil;
import com.utp.edu.pe.proyectoclinica.model.Usuario;
import com.utp.edu.pe.proyectoclinica.repository.IntentoFallidoRepository;
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
    private final IntentoFallidoRepository intentoFallidoRepository;
    private final RecursoSensibleService recursoSensibleService;

    @Autowired
    public AuthController(UsuarioRepository usuarioRepository,
                          IntentoFallidoRepository intentoFallidoRepository,
                          RecursoSensibleService recursoSensibleService) {
        this.usuarioRepository = usuarioRepository;
        this.intentoFallidoRepository = intentoFallidoRepository;
        this.recursoSensibleService = recursoSensibleService;
    }

    @PostMapping("/login")
    @Transactional
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        String username = credenciales.get("username");
        String password = credenciales.get("password");
        String tipoProveedor = credenciales.get("tipo");
        if (tipoProveedor == null || tipoProveedor.isBlank()) {
            tipoProveedor = "INTERNO";
        }

        try {
            ProveedorAutenticacion proveedor = AuthFactory.obtenerProveedor(tipoProveedor);
            proveedor.procesarAutenticacion();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }

        AutenticacionStrategy userPassStrategy = new AuthUserPasswordStrategy();
        boolean formatoValido = userPassStrategy.autenticar(username, password);

        String usuarioIntento = (username != null && !username.isBlank()) ? username.trim() : "DESCONOCIDO";

        Optional<Usuario> usuarioOpt = formatoValido
                ? usuarioRepository.findByUsername(usuarioIntento)
                : Optional.empty();

        String motivoFallo = null;
        if (!formatoValido) {
            motivoFallo = "CAMPOS_VACIOS";
        } else if (usuarioOpt.isEmpty()) {
            motivoFallo = "USUARIO_NO_EXISTE";
        } else if (!password.equals(usuarioOpt.get().getPassword())) {
            motivoFallo = "PASSWORD_INCORRECTA";
        }

        if (motivoFallo != null) {
            // Singleton -> LoginSubject (Observer) -> alerta en consola + registro en BD
            ConfiguracionSeguridadSingleton.getInstancia()
                    .getLoginSubject()
                    .registrarIntentoFallido(usuarioIntento, motivoFallo);

            return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
        }

        Usuario usuario = usuarioOpt.get();
        usuarioRepository.resetearIntentosFallidosNativo(usuario.getUsername());

        String rolUsuario = usuario.getRol() != null && !usuario.getRol().isBlank()
                ? usuario.getRol().trim().toUpperCase()
                : "USUARIO";
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
                "rol", rolUsuario,
                "username", usuario.getUsername()
        ));
    }

    // Permite verificar que los intentos fallidos realmente se estan guardando (solo ADMIN).
    @GetMapping("/intentos-fallidos")
    public ResponseEntity<?> listarIntentosFallidos(
            @RequestHeader(value = "Authorization", required = false) String token) {
        int estado = TokenUtil.validarAcceso(token, "/api/auth/intentos-fallidos", "ADMIN", "ADMINISTRADOR");
        if (estado != 200) {
            return ResponseEntity.status(estado).body(Map.of("error", TokenUtil.mensajeError(estado)));
        }
        return ResponseEntity.ok(intentoFallidoRepository.findTop100ByOrderByIdDesc());
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
            if (datosSensibles == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Historial médico no encontrado"));
            }
            return ResponseEntity.ok(Map.of("datos", datosSensibles));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("error", "Acceso denegado por el proxy de seguridad: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al consultar el recurso: " + e.getMessage()));
        }
    }
}
