package com.api.agenciamento.controller.dto;

import com.api.agenciamento.enums.StatusAgenciamentos;
import com.api.agenciamento.enums.TipoImovel;
import lombok.*;
import java.math.BigDecimal;
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode
@ToString
public class AgenciamentoResponseSemDetalhesDTO {
    private  Long id;
    private  String codigoAgs;
    private  String titulo;
    private  TipoImovel tipoImovel;
    private  StatusAgenciamentos status;
    private  BigDecimal valorVenda;
    private  String cidade;
    private  String bairro;
    private  BigDecimal areaM2;
    private  Integer quartos;
    private  Integer banheiros;
    private  Integer vagasGaragem;
    private String posicaoSolar;
    private Integer suite;
    private Boolean slideshow;
    private Boolean destaque;
}
