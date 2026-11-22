package com.utp.edu.pe.proyectoclinica.controller.Documento;

import com.utp.edu.pe.proyectoclinica.Factory.Documentos.HistorialMedico;
import com.utp.edu.pe.proyectoclinica.Proxy.RecursoSensibleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recurso-sensible")
@CrossOrigin(origins = "*")
public class DocumentoController {

    private final RecursoSensibleService recursoSensibleService;

    @Autowired
    public DocumentoController(RecursoSensibleService recursoSensibleService) {
        this.recursoSensibleService = recursoSensibleService;
    }

    @GetMapping("/historiales/{id}")
    public ResponseEntity<?> obtenerHistorialesSensibles(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        try {

            HistorialMedico historial = recursoSensibleService.accederAlRecurso(token, id);

            return ResponseEntity.ok(historial);

        } catch (SecurityException e){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}