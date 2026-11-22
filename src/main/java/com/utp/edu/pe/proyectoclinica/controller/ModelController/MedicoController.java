package com.utp.edu.pe.proyectoclinica.controller.ModelController;
import com.utp.edu.pe.proyectoclinica.model.Medico;
import com.utp.edu.pe.proyectoclinica.repository.MedicoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicos")
@CrossOrigin(origins = "*")
public class MedicoController {
 private final MedicoRepository medicoRepository;
 public MedicoController (MedicoRepository medicoRepository){
     this.medicoRepository = medicoRepository;
 }

 @GetMapping
    public List<Medico> listarMedicos(){
     return medicoRepository.findAll();
 }

 @PostMapping
    public Medico registrarMedico(@RequestBody Medico medico){
     return  medicoRepository.save(medico);
 }

 @GetMapping("/{id}")
    public ResponseEntity<Medico> buscarMedicoId (@PathVariable Long id){
     return medicoRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
 }

}
