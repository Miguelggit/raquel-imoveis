package com.api.raquelimoveis.agenciamento.controller.dto;

import com.api.raquelimoveis.agenciamento.enums.StatusAgenciamentos;
import com.api.raquelimoveis.agenciamento.enums.TipoImovel;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;
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

    public AgenciamentoResponseSemDetalhesDTO() {

    }

    public AgenciamentoResponseSemDetalhesDTO(Long id, String codigoAgs, String titulo, TipoImovel tipoImovel, StatusAgenciamentos status, BigDecimal valorVenda, String cidade, String bairro, BigDecimal areaM2, Integer quartos, Integer banheiros, Integer vagasGaragem) {
        this.id = id;
        this.codigoAgs = codigoAgs;
        this.titulo = titulo;
        this.tipoImovel = tipoImovel;
        this.status = status;
        this.valorVenda = valorVenda;
        this.cidade = cidade;
        this.bairro = bairro;
        this.areaM2 = areaM2;
        this.quartos = quartos;
        this.banheiros = banheiros;
        this.vagasGaragem = vagasGaragem;
    }

    public Long getId() {
        return id;
    }

    public String getCodigoAgs() {
        return codigoAgs;
    }

    public String getTitulo() {
        return titulo;
    }

    public TipoImovel getTipoImovel() {
        return tipoImovel;
    }

    public StatusAgenciamentos getStatus() {
        return status;
    }

    public BigDecimal getValorVenda() {
        return valorVenda;
    }

    public String getCidade() {
        return cidade;
    }

    public String getBairro() {
        return bairro;
    }

    public BigDecimal getAreaM2() {
        return areaM2;
    }

    public Integer getQuartos() {
        return quartos;
    }

    public Integer getBanheiros() {
        return banheiros;
    }

    public Integer getVagasGaragem() {
        return vagasGaragem;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        AgenciamentoResponseSemDetalhesDTO that = (AgenciamentoResponseSemDetalhesDTO) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "AgenciamentoResponseDTO{" +
                "id=" + id +
                ", codigoAgs='" + codigoAgs + '\'' +
                ", titulo='" + titulo + '\'' +
                ", tipoImovel=" + tipoImovel +
                ", status=" + status +
                ", valorVenda=" + valorVenda +
                ", cidade='" + cidade + '\'' +
                ", bairro='" + bairro + '\'' +
                ", areaM2=" + areaM2 +
                ", quartos=" + quartos +
                ", banheiros=" + banheiros +
                ", vagasGaragem=" + vagasGaragem +
                '}';
    }
}
