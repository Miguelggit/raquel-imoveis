package com.api.foto.mapper;

import com.api.foto.dto.FotoAgenciamentoResponseDTO;
import com.api.foto.database.model.FotoModel;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FotoMapper {

    public FotoAgenciamentoResponseDTO converterModelParaDTO(FotoModel model){
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
    public List<FotoAgenciamentoResponseDTO> converterListModelParaListDTO(List<FotoModel> listPhotos){
         return listPhotos.stream().map(this::converterModelParaDTO).toList();
    }
}
