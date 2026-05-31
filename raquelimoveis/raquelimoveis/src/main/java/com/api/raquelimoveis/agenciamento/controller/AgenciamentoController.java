package com.api.raquelimoveis.agenciamento.controller;
import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoRequestDTO;
import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoResponseDTO;
import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoResponseSemDetalhesDTO;
import com.api.raquelimoveis.agenciamento.service.AgenciamentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agenciamentos")
public class AgenciamentoController {
    private final AgenciamentoService service;

    public AgenciamentoController(AgenciamentoService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AgenciamentoResponseDTO cadastrarAGS(@Valid @RequestBody AgenciamentoRequestDTO dto){
        return service.cadastrarAgenciamento(dto);
    }

    @GetMapping
    public ResponseEntity<List<AgenciamentoResponseSemDetalhesDTO>> listarTodosAgenciamentos(){
        return ResponseEntity.ok(service.listarTodosAgs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgenciamentoResponseDTO> listarPorId(@Valid @PathVariable Long id){
        return ResponseEntity.ok(service.listarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgenciamentoResponseDTO> atualizarAgenciamento(@PathVariable Long id, @Valid @RequestBody AgenciamentoRequestDTO rqDTO){
        return ResponseEntity.ok(service.editarAgenciamento(id, rqDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDeleteById(@PathVariable Long id){
        service.softDelete(id);
        return ResponseEntity.noContent().build();
    }
}
