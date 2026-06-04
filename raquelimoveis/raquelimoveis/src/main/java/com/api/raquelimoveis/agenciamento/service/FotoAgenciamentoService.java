package com.api.raquelimoveis.agenciamento.service;
import com.api.raquelimoveis.agenciamento.controller.dto.FotoAgenciamentoResponseDTO;
import com.api.raquelimoveis.agenciamento.database.model.AgenciamentoModel;
import com.api.raquelimoveis.agenciamento.database.model.FotoAgenciamentoModel;
import com.api.raquelimoveis.agenciamento.database.repository.FotoAgenciamentoRepository;
import com.api.raquelimoveis.agenciamento.mapper.FotoAgenciamentoMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class FotoAgenciamentoService {

    private FotoAgenciamentoRepository repository;
    private AgenciamentoService serviceAgenciamento;
    private FotoAgenciamentoMapper mapper;

    public FotoAgenciamentoService(FotoAgenciamentoRepository repository, AgenciamentoService serviceAgenciamento, FotoAgenciamentoMapper mapper) {
        this.repository = repository;
        this.serviceAgenciamento = serviceAgenciamento;
        this.mapper = mapper;
    }

    public FotoAgenciamentoResponseDTO uploadPhoto(Long agenciamentoId, MultipartFile file) throws IOException {
        AgenciamentoModel agenciamento = serviceAgenciamento.buscarAgenciamentoPorId(agenciamentoId);
        FotoAgenciamentoModel model = new FotoAgenciamentoModel();
        model.setAgenciamentoModel(agenciamento);
        model.setNomeArmazenado(UUID.randomUUID().toString() + file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")));
        model.setContentType(file.getContentType());
        model.setNomeArquivo(file.getOriginalFilename());
        model.setTamanho(file.getSize());
        model.setUrl("fotos/"+ model.getNomeArmazenado());

        FotoAgenciamentoModel saved = repository.save(model);

        String uploadDir = "fotos/";
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);
        Path targetLocation = uploadPath.resolve(model.getNomeArmazenado());
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return mapper.converterModelParaDTO(saved);
    }
}
