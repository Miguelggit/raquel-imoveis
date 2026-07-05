package com.api.foto.service;
import com.api.agenciamento.service.AgenciamentoService;
import com.api.exceptions.PrincipalNaoEncontradoException;
import com.api.foto.dto.FotoAgenciamentoResponseDTO;
import com.api.foto.dto.FotoArquivoDTO;
import com.api.agenciamento.database.model.AgenciamentoModel;
import com.api.foto.database.model.FotoModel;
import com.api.foto.database.repository.FotoRepository;
import com.api.exceptions.ArquivoVazioException;
import com.api.exceptions.FormatoInvalidoException;
import com.api.exceptions.IdentificadorNaoEncontradoException;
import com.api.foto.mapper.FotoMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class FotoService {

    private FotoRepository repository;
    private AgenciamentoService serviceAgenciamento;
    private FotoMapper mapper;
    @Value("${app.upload.dir}")
    private String uploadDir;

    public FotoService(FotoRepository repository, AgenciamentoService serviceAgenciamento, FotoMapper mapper) {
        this.repository = repository;
        this.serviceAgenciamento = serviceAgenciamento;
        this.mapper = mapper;
    }

    public FotoAgenciamentoResponseDTO uploadPhoto(Long agenciamentoId, MultipartFile file) throws IOException {
        AgenciamentoModel agenciamento = serviceAgenciamento.buscarAgenciamentoPorId(agenciamentoId);
        List<String> formatosAceitos = List.of("image/jpeg", "image/png", "image/webp");
        if(!formatosAceitos.contains(file.getContentType())){
            throw new FormatoInvalidoException("Formato invalido! Formatos suportados: .png; .jpeg; .webp");
        }
        FotoModel model = new FotoModel();
        model.setAgenciamentoModel(agenciamento);
        model.setNomeArmazenado(UUID.randomUUID().toString() + file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")));
        model.setContentType(file.getContentType());
        model.setNomeArquivo(file.getOriginalFilename());
        model.setTamanho(file.getSize());
        model.setUrl(uploadDir + model.getNomeArmazenado());

        FotoModel saved = repository.save(model);

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);
        Path targetLocation = uploadPath.resolve(model.getNomeArmazenado());
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return mapper.converterModelParaDTO(saved);
    }
    public List<FotoAgenciamentoResponseDTO> findAllPhotosByAgenciamento(Long id){
         return mapper.converterListModelParaListDTO(repository.findByAgenciamentoModelId(id));
    }
    public FotoArquivoDTO showPhoto( String nomeArmazenado) throws IOException {
        FotoModel targetPhoto = repository.findByNomeArmazenado(nomeArmazenado); // Busca a Foto pelo nomeArmazenado dela
        if(targetPhoto == null){
            throw new ArquivoVazioException("O arquivo que você estava buscando não existe :(");
        }
        byte[] conteudo = Files.readAllBytes(Paths.get(targetPhoto.getUrl()).normalize()); // Leitura de um arquivo pelo seu caminha convertendo ele para um byte
        String contentType = Files.probeContentType(Paths.get(targetPhoto.getUrl()).normalize());
        if(contentType == null){
            contentType = "application/octet-stream";
        }
        MediaType contentMediaType = MediaType.parseMediaType(contentType);
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
        FotoModel fotoTarget = repository.findById(id)
                .orElseThrow(() -> new IdentificadorNaoEncontradoException("A foto que você está procurando não está aqui :/"));
        Path filePathDele = Paths.get(uploadDir+File.separator+fotoTarget.getNomeArmazenado());
        Files.deleteIfExists(filePathDele);
        repository.delete(fotoTarget);
    }
    public void definirCapa(Long id, Long idFoto){
        List<FotoModel> fotos = repository.findByAgenciamentoModelId(id);
        for(FotoModel foto: fotos){
            foto.setPrincipal(foto.getId().equals(idFoto));
        }
        repository.saveAll(fotos);
    }
}
