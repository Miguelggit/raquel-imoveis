package com.api.raquelimoveis.agenciamento.controller;
import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoRequestDTO;
import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoResponseDTO;
import com.api.raquelimoveis.agenciamento.service.AgenciamentoService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/agenciamento")
public class AgenciamentoController {
    private final AgenciamentoService service;

    public AgenciamentoController(AgenciamentoService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AgenciamentoResponseDTO cadastrarAGS(@RequestBody AgenciamentoRequestDTO dto){
        return service.cadastrarAgenciamento(dto);
    }
}
