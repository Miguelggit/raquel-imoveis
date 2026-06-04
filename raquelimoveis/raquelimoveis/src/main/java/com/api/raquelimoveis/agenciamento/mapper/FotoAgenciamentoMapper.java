package com.api.raquelimoveis.agenciamento.mapper;

import com.api.raquelimoveis.agenciamento.controller.dto.FotoAgenciamentoResponseDTO;
import com.api.raquelimoveis.agenciamento.controller.dto.FotoArquivoDTO;
import com.api.raquelimoveis.agenciamento.database.model.FotoAgenciamentoModel;
import org.springframework.stereotype.Component;

import java.util.List;

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
    public List<FotoAgenciamentoResponseDTO> converterListModelParaListDTO(List<FotoAgenciamentoModel> listPhotos){
         return listPhotos.stream().map(this::converterModelParaDTO).toList();
    }
}
