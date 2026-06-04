package com.api.raquelimoveis.agenciamento.service;
import com.api.raquelimoveis.agenciamento.controller.dto.FotoAgenciamentoResponseDTO;
import com.api.raquelimoveis.agenciamento.controller.dto.FotoArquivoDTO;
import com.api.raquelimoveis.agenciamento.database.model.AgenciamentoModel;
import com.api.raquelimoveis.agenciamento.database.model.FotoAgenciamentoModel;
import com.api.raquelimoveis.agenciamento.database.repository.FotoAgenciamentoRepository;
import com.api.raquelimoveis.agenciamento.exceptions.IdentificadorNaoEncontradoException;
import com.api.raquelimoveis.agenciamento.mapper.FotoAgenciamentoMapper;
import jakarta.servlet.Filter;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.print.attribute.standard.Media;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FotoAgenciamentoService {

    private FotoAgenciamentoRepository repository;
    private AgenciamentoService serviceAgenciamento;
    private FotoAgenciamentoMapper mapper;
    private final String uploadDir = "raquelimoveis/src/main/java/uploads/";

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
        model.setUrl(uploadDir + model.getNomeArmazenado());

        FotoAgenciamentoModel saved = repository.save(model);

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);
        Path targetLocation = uploadPath.resolve(model.getNomeArmazenado());
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return mapper.converterModelParaDTO(saved);
    }
    public List<FotoAgenciamentoResponseDTO> findAllPhotosByAgenciamento(Long id){
         return mapper.converterListModelParaListDTO(repository.findByAgenciamentoModelId(id));
    }
    public FotoArquivoDTO showPhoto(String nomeArmazenado) throws IOException {
        FotoAgenciamentoModel targetPhoto = repository.findByNomeArmazenado(nomeArmazenado); // Busca a Foto pelo nomeArmazenado dela
        byte[] conteudo = Files.readAllBytes(Paths.get(targetPhoto.getUrl()).normalize()); // Leitura de um arquivo pelo seu caminha convertendo ele para um byte
        String contentType = Files.probeContentType(Paths.get(targetPhoto.getUrl()).normalize());
        MediaType contentMediaType = MediaType.parseMediaType(contentType);
        if(contentType == null){
            contentType = "application/octet-stream";
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.setContentDisposition(ContentDisposition.inline().filename(nomeArmazenado).build());
        return new FotoArquivoDTO(
                conteudo,
                contentMediaType,
                headers
        );
    }
    public void deletePhoto (Long id) throws IOException {
        FotoAgenciamentoModel fotoTarget = repository.findById(id)
                .orElseThrow(() -> new IdentificadorNaoEncontradoException("A foto que você está procurando não está aqui :/"));
        Path filePathDele = Paths.get(uploadDir+File.separator+fotoTarget.getNomeArmazenado());
        Files.deleteIfExists(filePathDele);
        repository.delete(fotoTarget);
    }
}
