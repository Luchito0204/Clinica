package com.utp.edu.pe.proyectoclinica.controller.Autenticacion;

import com.utp.edu.pe.proyectoclinica.ChainOfResponsability.SeguridadChainClient;
import com.utp.edu.pe.proyectoclinica.Factory.Provedoor.AuthFactory;
import com.utp.edu.pe.proyectoclinica.Factory.Provedoor.ProveedorAutenticacion;
import com.utp.edu.pe.proyectoclinica.Observer.AlertaSeguridadObserver;
import com.utp.edu.pe.proyectoclinica.Observer.LoginSubject;
import com.utp.edu.pe.proyectoclinica.Proxy.RecursoSensibleService;
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
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales){
        String username = credenciales.get("username");
        String password = credenciales.get("password");
        String tipoProveedor = credenciales.getOrDefault("tipo", "INTERNO");

        ProveedorAutenticacion proveedor = AuthFactory.obtenerProveedor(tipoProveedor);
        proveedor.procesarAutenticacion();

        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(username);

        AutenticacionStrategy strategy = new AuthUserPasswordStrategy();
        boolean credencialesValidas = usuarioOpt.isPresent() && usuarioOpt.get().getPassword().equals(password);

        if(!credencialesValidas){
            if(usuarioOpt.isPresent()) {
                Usuario usuarioFallido = usuarioOpt.get();
                int intentosActuales = usuarioFallido.getIntentosFallidos();
                usuarioFallido.setIntentosFallidos(intentosActuales + 1);
                usuarioRepository.incrementarIntentosFallidosNativo(username);
            }
            LoginSubject loginSubject = new LoginSubject();
            loginSubject.agregarObservador(new AlertaSeguridadObserver());
            loginSubject.registrarIntentoFallido(username);

            return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
        }

        Usuario usuario = usuarioOpt.get();

        usuario.setIntentosFallidos(0);
        usuarioRepository.resetearIntentosFallidosNativo(username);

        boolean cadenaSuperada = SeguridadChainClient.ejecutarCadena("JWT_TOKEN_GENERADO_XYZ", "ADMIN", "/api/auth/login");
        if(!cadenaSuperada){
            return ResponseEntity.status(403).body(Map.of("error", "Acceso denegado"));
        }

        return ResponseEntity.ok(Map.of(
                "mensaje", "Login exitoso",
                "token", "Bearer-Admin-Token123456" + usuario.getUsername(),
                "usuario", usuario.getRol()));
    }

    @GetMapping("/recurso-protegido/{id}")
    public ResponseEntity<?> accederRecurso(@RequestHeader("Authorization") String token, @PathVariable Long id){
        try{
            Object datosSensibles = recursoSensibleService.accederAlRecurso(token, id);

            return ResponseEntity.ok(Map.of("datos", datosSensibles));
        } catch (Exception e){
            return ResponseEntity.status(403).body(Map.of("error", "Acceso denegado por el proxy de seguridad: " + e.getMessage()));
        }
    }
}