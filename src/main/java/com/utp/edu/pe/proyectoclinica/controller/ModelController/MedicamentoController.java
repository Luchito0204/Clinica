package com.utp.edu.pe.proyectoclinica.controller.ModelController;
import com.utp.edu.pe.proyectoclinica.model.Medicamento;
import com.utp.edu.pe.proyectoclinica.repository.MedicamentoRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medicamentos")
public class MedicamentoController {
    private final MedicamentoRepository medicamentoRepository;

    public MedicamentoController (MedicamentoRepository medicamentoRepository){
        this.medicamentoRepository = medicamentoRepository;
    }

    @GetMapping
    public List<Medicamento> listarMedicamentos(){
        return medicamentoRepository.findAll();
    }

    @PostMapping
    public Medicamento registrarMedicamento(@RequestBody Medicamento medicamento){
      return medicamentoRepository.save(medicamento);
    }

    @GetMapping("/buscar")
    public List<Medicamento> buscarMedicamentoPorNombre(@RequestParam String termino) {
        return medicamentoRepository.findByNombreMedicamentoContainingIgnoreCase(termino);
    }
}
