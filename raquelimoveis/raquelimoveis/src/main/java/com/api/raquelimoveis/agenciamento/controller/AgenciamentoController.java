package com.api.raquelimoveis.agenciamento.controller;
import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoRequestDTO;
import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoResponseDTO;
import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoResponseSemDetalhesDTO;
import com.api.raquelimoveis.agenciamento.database.model.AgenciamentoModel;
import com.api.raquelimoveis.agenciamento.enums.StatusAgenciamentos;
import com.api.raquelimoveis.agenciamento.enums.TipoImovel;
import com.api.raquelimoveis.agenciamento.service.AgenciamentoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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
    public ResponseEntity<Page<AgenciamentoModel>> listarTodosAgenciamentos(@RequestParam(required = false) TipoImovel tipoImovel,
                                                                            @RequestParam(required = false) StatusAgenciamentos status,
                                                                            @RequestParam(required = false) String cidade,
                                                                            @RequestParam(required = false) String bairro,
                                                                            @RequestParam(required = false) BigDecimal precoMin,
                                                                            @RequestParam(required = false) BigDecimal precoMax,
                                                                            Pageable pageable){
        return ResponseEntity.ok(service.filtragem(tipoImovel, status, cidade, bairro, precoMin, precoMax, pageable));
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
