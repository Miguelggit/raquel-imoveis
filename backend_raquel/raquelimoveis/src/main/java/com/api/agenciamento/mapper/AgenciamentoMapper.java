package com.api.agenciamento.mapper;

import com.api.agenciamento.controller.dto.AgenciamentoPageResponseDTO;
import com.api.agenciamento.controller.dto.AgenciamentoRequestDTO;
import com.api.agenciamento.controller.dto.AgenciamentoResponseDTO;
import com.api.agenciamento.controller.dto.AgenciamentoResponseSemDetalhesDTO;
import com.api.agenciamento.database.model.AgenciamentoModel;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AgenciamentoMapper {
    public AgenciamentoResponseSemDetalhesDTO converterParaDTOSemDetalhes(AgenciamentoModel model){
        return new AgenciamentoResponseSemDetalhesDTO(
                model.getId(),
                model.getCodigoAgs(),
                model.getTitulo(),
                model.getTipoImovel(),
                model.getStatus(),
                model.getValorVenda(),
                model.getCidade(),
                model.getBairro(),
                model.getAreaM2(),
                model.getQuartos(),
                model.getBanheiros(),
                model.getVagasGaragem(),
                model.getPosicaoSolar(),
                model.getSuite()
        );
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
                model.getPosicaoSolar(),
                model.getSuite(),
                model.getCriadoEM(),
                model.getAtualizadoEM()
        );
    }
    public AgenciamentoModel converterParaModel(AgenciamentoRequestDTO requestDTO){
        AgenciamentoModel ags = new AgenciamentoModel();
        ags.setBairro(requestDTO.getBairro());
        ags.setStatus(requestDTO.getStatus());
        ags.setValorVenda(requestDTO.getValorVenda());
        ags.setBanheiros(requestDTO.getBanheiros());
        ags.setCidade(requestDTO.getCidade());
        ags.setComplemento(requestDTO.getComplemento());
        ags.setDescricao(requestDTO.getDescricao());
        ags.setNumero(requestDTO.getNumero());
        ags.setQuartos(requestDTO.getQuartos());
        ags.setRua(requestDTO.getRua());
        ags.setAreaM2(requestDTO.getAreaM2());
        ags.setTitulo(requestDTO.getTitulo());
        ags.setTipoImovel(requestDTO.getTipoImovel());
        ags.setStatus(requestDTO.getStatus());
        ags.setVagasGaragem(requestDTO.getVagasGaragem());
        ags.setPosicaoSolar(requestDTO.getPosicaoSolar());
        ags.setSuite(requestDTO.getSuite());
        return ags;
    }
    public void atualizarModel(AgenciamentoModel model, AgenciamentoRequestDTO requestDTO){
        model.setBairro(requestDTO.getBairro());
        model.setStatus(requestDTO.getStatus());
        model.setValorVenda(requestDTO.getValorVenda());
        model.setBanheiros(requestDTO.getBanheiros());
        model.setCidade(requestDTO.getCidade());
        model.setComplemento(requestDTO.getComplemento());
        model.setDescricao(requestDTO.getDescricao());
        model.setNumero(requestDTO.getNumero());
        model.setQuartos(requestDTO.getQuartos());
        model.setRua(requestDTO.getRua());
        model.setAreaM2(requestDTO.getAreaM2());
        model.setTitulo(requestDTO.getTitulo());
        model.setTipoImovel(requestDTO.getTipoImovel());
        if (requestDTO.getStatus() != null) {
            model.setStatus(requestDTO.getStatus());
        }
        model.setVagasGaragem(requestDTO.getVagasGaragem());
        model.setPosicaoSolar(requestDTO.getPosicaoSolar());
        model.setSuite(requestDTO.getSuite());
    }
    public AgenciamentoPageResponseDTO converterPageParaDTO(Page<AgenciamentoModel> page ){
        List<AgenciamentoResponseSemDetalhesDTO> content = page.getContent().stream()
                                                                         .map(this::converterParaDTOSemDetalhes)
                                                                         .toList();
        return new AgenciamentoPageResponseDTO(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }

}
