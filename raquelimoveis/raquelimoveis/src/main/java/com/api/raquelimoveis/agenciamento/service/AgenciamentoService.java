package com.api.raquelimoveis.agenciamento.service;
import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoRequestDTO;
import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoResponseDTO;
import com.api.raquelimoveis.agenciamento.database.model.AgenciamentoModel;
import com.api.raquelimoveis.agenciamento.database.repository.AgenciamentoRepository;
import com.api.raquelimoveis.agenciamento.enums.StatusAgenciamentos;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class  AgenciamentoService {
    private AgenciamentoRepository repository;
    private static final Logger log = LoggerFactory.getLogger(AgenciamentoService.class);

    public AgenciamentoService(AgenciamentoRepository repository) {
        this.repository = repository;
    }

    public AgenciamentoResponseDTO cadastrarAgenciamento(AgenciamentoRequestDTO dto){
            if(dto.getStatus() == null) {
                dto.setStatus(StatusAgenciamentos.DISPONIVEL);
            }
            AgenciamentoModel ags = new AgenciamentoModel();
            ags.setBairro(dto.getBairro());
            ags.setValorVenda(dto.getValorVenda());
            ags.setBanheiros(dto.getBanheiros());
            ags.setCidade(dto.getCidade());
            ags.setComplemento(dto.getComplemento());
            ags.setDescricao(dto.getDescricao());
            ags.setNumero(dto.getNumero());
            ags.setQuartos(dto.getQuartos());
            ags.setRua(dto.getRua());
            ags.setAreaM2(dto.getAreaM2());
            ags.setTitulo(dto.getTitulo());
            ags.setTipoImovel(dto.getTipoImovel());
            ags.setStatus(dto.getStatus());
            String maxCodAgs = repository.findMaxCodigoAgs();
            ags.setCodigoAgs(geradorDeCodigoAGS(maxCodAgs));
            AgenciamentoModel salvado = repository.save(ags);
            return converterParaDTO(salvado);
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
    public AgenciamentoResponseDTO converterParaDTO(AgenciamentoModel model){
        return new AgenciamentoResponseDTO(
                model.getId(),
                model.getCodigoAgs(),
                model.getTitulo(),
                model.getDescricao(),
                model.getTipoImovel(),
                model.getStatus(),
                model.getValorVenda(),
                model.getCidade(),
                model.getBairro(),
                model.getRua(),
                model.getNumero(),
                model.getComplemento(),
                model.getAreaM2(),
                model.getQuartos(),
                model.getBanheiros(),
                model.getVagasGaragem(),
                model.getCriadoEM(),
                model.getAtualizadoEM()
        );
    }

    public List<AgenciamentoResponseDTO> listarTodosAgs(){
        List<AgenciamentoModel> listaAgs = repository.findAll();
        return listaAgs.stream()
                .filter(status -> !status.getStatus().equals(StatusAgenciamentos.INATIVO))
                .map(this::converterParaDTO)
                .toList();
    }
}
