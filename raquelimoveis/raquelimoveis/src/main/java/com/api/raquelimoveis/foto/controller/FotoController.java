package com.api.raquelimoveis.agenciamento.controller;

import com.api.raquelimoveis.agenciamento.controller.dto.FotoAgenciamentoResponseDTO;
import com.api.raquelimoveis.agenciamento.controller.dto.FotoArquivoDTO;
import com.api.raquelimoveis.agenciamento.service.FotoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/api/agenciamentos")
public class FotoController {

    private FotoService service;

    public FotoController(FotoService service) {
        this.service = service;
    }

    @PostMapping("/{id}/fotos")
    public ResponseEntity<FotoAgenciamentoResponseDTO> uploadPhoto(@PathVariable Long id, @RequestParam("foto") MultipartFile foto) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.uploadPhoto(id, foto));
    }
    @GetMapping("/{id}/fotos")
    public ResponseEntity<List<FotoAgenciamentoResponseDTO>> findAllPhotosByAgenciamento(@PathVariable Long id){
        return ResponseEntity.ok(service.findAllPhotosByAgenciamento(id));
    }
    @GetMapping("/fotos/{nomeArmazenado}")
    public ResponseEntity<byte[]> showPhoto(@PathVariable String nomeArmazenado) throws IOException {
        FotoArquivoDTO response = service.showPhoto(nomeArmazenado);
    return ResponseEntity.ok()
            .contentType(response.getContentType())
            .headers(response.getHeaders())
            .body(response.getConteudo());
    }
    @DeleteMapping("/fotos/{id}")
    public ResponseEntity<Void> deletePhotoByStoregedName(@PathVariable Long id) throws IOException {
        service.deletePhoto(id);
        return ResponseEntity.noContent().build();
    }
}