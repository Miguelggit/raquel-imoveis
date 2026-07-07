package com.api.foto.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FotoAgenciamentoResponseDTO {
    private Long id;

    private String nomeArquivo;

    private String nomeArmazenado;

    private String contentType;

    private Long tamanho;

    private String url;

    private Long agenciamentoId;

    private Boolean principal;

    private LocalDateTime criadoEM;
}
