package com.api.raquelimoveis.agenciamento.controller;

import com.api.raquelimoveis.agenciamento.controller.dto.FotoAgenciamentoResponseDTO;
import com.api.raquelimoveis.agenciamento.service.FotoAgenciamentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
@RequestMapping("/api/agenciamentos")
public class FotoAgenciamentoController {

    private FotoAgenciamentoService service;

    public FotoAgenciamentoController(FotoAgenciamentoService service) {
        this.service = service;
    }

    @PostMapping("/{id}/fotos")
    public ResponseEntity<FotoAgenciamentoResponseDTO> uploadPhoto(@PathVariable Long id, @RequestParam("foto") MultipartFile foto) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.uploadPhoto(id, foto));
    }
}
