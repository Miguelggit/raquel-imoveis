package com.api.agenciamento.controller.dto;

import com.api.agenciamento.enums.StatusAgenciamentos;
import com.api.agenciamento.enums.TipoImovel;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;
import java.lang.Long;
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
@Data
public class AgenciamentoResponseDTO {
    private  Long id;
    private  String codigoAgs;
    private  String titulo;
    private  String descricao;
    private  TipoImovel tipoImovel;
    private  StatusAgenciamentos status;
    private  BigDecimal valorVenda;
    private  String cidade;
    private  String bairro;
    private  String rua;
    private  String numero;
    private  String complemento;
    private  BigDecimal areaM2;
    private  Integer quartos;
    private  Integer banheiros;
    private  Integer vagasGaragem;
    private String posicaoSolar;
    private Integer suite;
    private  LocalDateTime criadoEM;
    private  LocalDateTime atualizadoEM;

}
