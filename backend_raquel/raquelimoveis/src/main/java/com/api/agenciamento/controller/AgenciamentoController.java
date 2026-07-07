package com.api.agenciamento.controller;
import com.api.agenciamento.controller.dto.AgenciamentoPageResponseDTO;
import com.api.agenciamento.controller.dto.AgenciamentoRequestDTO;
import com.api.agenciamento.controller.dto.AgenciamentoResponseDTO;
import com.api.agenciamento.enums.StatusAgenciamentos;
import com.api.agenciamento.enums.TipoImovel;
import com.api.agenciamento.service.AgenciamentoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

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
    public ResponseEntity<AgenciamentoPageResponseDTO> listarTodosAgenciamentos(@RequestParam(required = false) StatusAgenciamentos status,
                                                                                @RequestParam(required = false) TipoImovel tipoImovel,
                                                                                @RequestParam(required = false) String bairro,
                                                                                @RequestParam(required = false) String cidade,
                                                                                @RequestParam(required = false) BigDecimal precoMin,
                                                                                @RequestParam(required = false) BigDecimal precoMax,
                                                                                @RequestParam(required = false) String posicaoSolar,
                                                                                @RequestParam(required = false) Integer suite,
                                                                                @RequestParam(required = false, defaultValue = "false") boolean incluirInativos,
                                                                                Pageable pageable){
        return ResponseEntity.ok(service.filtros(tipoImovel, status, cidade, bairro, precoMin, precoMax, posicaoSolar, suite, incluirInativos, pageable));
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
