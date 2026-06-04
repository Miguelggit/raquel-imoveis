package com.api.raquelimoveis.agenciamento.mapper;

import com.api.raquelimoveis.agenciamento.controller.dto.FotoAgenciamentoResponseDTO;
import com.api.raquelimoveis.agenciamento.database.model.FotoAgenciamentoModel;
import org.springframework.stereotype.Component;

@Component
public class FotoAgenciamentoMapper {

    public FotoAgenciamentoResponseDTO converterModelParaDTO(FotoAgenciamentoModel model){
        return new FotoAgenciamentoResponseDTO(
                model.getId(),
                model.getNomeArquivo(),
                model.getNomeArmazenado(),
                model.getContentType(),
                model.getTamanho(),
                model.getUrl(),
                model.getAgenciamentoModel().getId(),
                model.getCriadoEM()
        );
    }
}
