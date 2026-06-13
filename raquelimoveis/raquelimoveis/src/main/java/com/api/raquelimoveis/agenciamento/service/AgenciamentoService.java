package com.api.raquelimoveis.agenciamento.service;
import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoPageResponseDTO;
import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoRequestDTO;
import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoResponseDTO;
import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoResponseSemDetalhesDTO;
import com.api.raquelimoveis.agenciamento.database.model.AgenciamentoModel;
import com.api.raquelimoveis.agenciamento.database.repository.AgenciamentoRepository;
import com.api.raquelimoveis.agenciamento.enums.StatusAgenciamentos;
import com.api.raquelimoveis.agenciamento.enums.TipoImovel;
import exceptions.CadastroDeStatusException;
import exceptions.IdentificadorNaoEncontradoException;
import exceptions.InativarAgenciamentoException;
import com.api.raquelimoveis.agenciamento.mapper.AgenciamentoMapper;
import com.api.raquelimoveis.agenciamento.specification.AgenciamentoSpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class  AgenciamentoService {
    private AgenciamentoRepository repository;
    private AgenciamentoMapper mapper;
    private static final Logger log = LoggerFactory.getLogger(AgenciamentoService.class);

    public AgenciamentoService(AgenciamentoRepository repository, AgenciamentoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public AgenciamentoResponseDTO cadastrarAgenciamento(AgenciamentoRequestDTO dto){
            if(dto.getStatus() == null) {
                dto.setStatus(StatusAgenciamentos.DISPONIVEL);
            }
            if(dto.getStatus().equals(StatusAgenciamentos.INATIVO) || dto.getStatus().equals(StatusAgenciamentos.VENDIDO)) {
                throw new CadastroDeStatusException("Este status não pode ser cadastrado");
            }
            AgenciamentoModel ags = mapper.converterParaModel(dto);
            String maxCodAgs = repository.findMaxCodigoAgs();
            ags.setCodigoAgs(geradorDeCodigoAGS(maxCodAgs));
            AgenciamentoModel salvado = repository.save(ags);
            return mapper.converterParaDTO(salvado);
    }
    public String geradorDeCodigoAGS(String cod){
        if(cod == null){
            return "AGS-001";
        }
        Long codConvertido = Long.parseLong(cod.replaceAll("[^\\d]", ""));
        log.info("Codigo convertido para Long: {}", codConvertido);
        codConvertido++;
        return String.format("AGS-%03d", codConvertido);
    }
    public List<AgenciamentoResponseSemDetalhesDTO> listarTodosAgs(){
        List<AgenciamentoModel> listaAgs = repository.findAll();
        return listaAgs.stream()
                .filter(status -> !status.getStatus().equals(StatusAgenciamentos.INATIVO))
                .map(agenciamentoModel -> mapper.converterParaDTOSemDetalhes(agenciamentoModel))
                .toList();
    }
    public AgenciamentoResponseDTO listarPorId(Long id){
        AgenciamentoModel ags = buscarAgenciamentoPorId(id);
        return mapper.converterParaDTO(ags);
    }
    public AgenciamentoResponseDTO editarAgenciamento(Long id, AgenciamentoRequestDTO dto){
        log.info("Iniciando metodo de editar com sucesso");
        AgenciamentoModel ags = buscarAgenciamentoPorId(id);
        mapper.atualizarModel(ags, dto);
        AgenciamentoModel saved = repository.save(ags);
        return mapper.converterParaDTO(saved);
    }
    public void softDelete(Long id){
        AgenciamentoModel ags = buscarAgenciamentoPorId(id);
        if(ags.getStatus().equals(StatusAgenciamentos.INATIVO)){
            throw new InativarAgenciamentoException("ID: "+ id + " já esta INATIVO" );
        }
        ags.setStatus(StatusAgenciamentos.INATIVO);
        repository.save(ags);
    }
    public AgenciamentoModel buscarAgenciamentoPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new IdentificadorNaoEncontradoException("O ID: " + id + " não foi encontrado"));
    }
    public AgenciamentoPageResponseDTO filtros(TipoImovel tipoImovel,
                                               StatusAgenciamentos status,
                                               String cidade,
                                               String bairro,
                                               BigDecimal precoMin,
                                               BigDecimal precoMax,
                                               Pageable pageable){
        Specification<AgenciamentoModel> spec = AgenciamentoSpecification.statusDiferentesDe(StatusAgenciamentos.INATIVO);
        if(tipoImovel != null){
            spec = spec.and(AgenciamentoSpecification.porTipoDeImovel(tipoImovel));
        }
        if(status != null){
            spec = spec.and(AgenciamentoSpecification.porStatus(status));
        }
        if(cidade != null){
            spec = spec.and(AgenciamentoSpecification.porCidade(cidade));
        }
        if(bairro != null){
            spec = spec.and(AgenciamentoSpecification.porBairro(bairro));
        }
        if(precoMin != null){
            spec = spec.and(AgenciamentoSpecification.porPrecoMinimo(precoMin));
        }
        if(precoMax != null){
            spec = spec.and(AgenciamentoSpecification.porPrecoMaximo(precoMax));
        }
        return mapper.converterPageParaDTO(repository.findAll(spec, pageable));
    }

}
