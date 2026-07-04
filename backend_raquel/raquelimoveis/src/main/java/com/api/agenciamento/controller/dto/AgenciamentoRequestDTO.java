package com.api.agenciamento.controller.dto;

import com.api.agenciamento.enums.StatusAgenciamentos;
import com.api.agenciamento.enums.TipoImovel;
import jakarta.persistence.Column;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.ToString;

import java.math.BigDecimal;

@Data
@ToString
public class AgenciamentoRequestDTO {
    @NotBlank
    @Size(min = 5, max = 150)
    private String titulo;
    @Size(min = 0, max = 3000)
    private String descricao;
    @NotNull
    private TipoImovel tipoImovel;
    private StatusAgenciamentos status;
    @NotNull
    @DecimalMin(value = "1.00")
    private BigDecimal valorVenda;
    @NotBlank
    @Size(max = 100)
    private String cidade;
    @NotBlank
    @Size(max = 100)
    private String bairro;
    @Size(max = 150)
    private String rua;
    @Size(max = 20)
    private String numero;
    @Size(max = 100)
    private String complemento;
    @NotNull
    @DecimalMin(value = "1.00")
    private BigDecimal areaM2;
    @Min(value = 0)
    private Integer quartos;
    @Min(value = 0)
    private Integer banheiros;
    @Min(value = 0)
    private Integer vagasGaragem;

    private String posicaoSolar;
    @Min(0)
    private Integer suite;
}
