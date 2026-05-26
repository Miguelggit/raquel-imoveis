package com.api.raquelimoveis.agenciamento.mapper;

import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoRequestDTO;
import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoResponseDTO;
import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoResponseSemDetalhesDTO;
import com.api.raquelimoveis.agenciamento.database.model.AgenciamentoModel;
import org.springframework.stereotype.Component;

@Component
public class AgenciamentoMapper {
    public AgenciamentoResponseSemDetalhesDTO converterParaDTOSemDetahles(AgenciamentoModel model){
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
                model.getVagasGaragem()
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
                model.getCriadoEM(),
                model.getAtualizadoEM()
        );
    }
    public AgenciamentoModel converterParaModel(AgenciamentoRequestDTO requestDTOdto){
        AgenciamentoModel ags = new AgenciamentoModel();
        ags.setBairro(requestDTOdto.getBairro());
        ags.setValorVenda(requestDTOdto.getValorVenda());
        ags.setBanheiros(requestDTOdto.getBanheiros());
        ags.setCidade(requestDTOdto.getCidade());
        ags.setComplemento(requestDTOdto.getComplemento());
        ags.setDescricao(requestDTOdto.getDescricao());
        ags.setNumero(requestDTOdto.getNumero());
        ags.setQuartos(requestDTOdto.getQuartos());
        ags.setRua(requestDTOdto.getRua());
        ags.setAreaM2(requestDTOdto.getAreaM2());
        ags.setTitulo(requestDTOdto.getTitulo());
        ags.setTipoImovel(requestDTOdto.getTipoImovel());
        ags.setStatus(requestDTOdto.getStatus());
        ags.setVagasGaragem(requestDTOdto.getVagasGaragem());
        return ags;
    }

}
