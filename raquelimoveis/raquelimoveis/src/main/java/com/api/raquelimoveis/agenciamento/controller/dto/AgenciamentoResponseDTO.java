package com.api.raquelimoveis.agenciamento.controller.dto;

import com.api.raquelimoveis.agenciamento.enums.StatusAgenciamentos;
import com.api.raquelimoveis.agenciamento.enums.TipoImovel;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;
import java.lang.Long;
@Component
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
    private  LocalDateTime criadoEM;
    private  LocalDateTime atualizadoEM;

    public AgenciamentoResponseDTO() {

    }

    public AgenciamentoResponseDTO(Long id, String codigoAgs, String titulo, String descricao, TipoImovel tipoImovel, StatusAgenciamentos status, BigDecimal valorVenda, String cidade, String bairro, String rua, String numero, String complemento, BigDecimal areaM2, Integer quartos, Integer banheiros, Integer vagasGaragem, LocalDateTime criadoEM, LocalDateTime atualizadoEM) {
        this.id = id;
        this.codigoAgs = codigoAgs;
        this.titulo = titulo;
        this.descricao = descricao;
        this.tipoImovel = tipoImovel;
        this.status = status;
        this.valorVenda = valorVenda;
        this.cidade = cidade;
        this.bairro = bairro;
        this.rua = rua;
        this.numero = numero;
        this.complemento = complemento;
        this.areaM2 = areaM2;
        this.quartos = quartos;
        this.banheiros = banheiros;
        this.vagasGaragem = vagasGaragem;
        this.criadoEM = criadoEM;
        this.atualizadoEM = atualizadoEM;
    }

    public long getId() {
        return id;
    }

    public String getCodigoAgs() {
        return codigoAgs;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getDescricao() {
        return descricao;
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

    public String getRua() {
        return rua;
    }

    public String getNumero() {
        return numero;
    }

    public String getComplemento() {
        return complemento;
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

    public LocalDateTime getCriadoEM() {
        return criadoEM;
    }

    public LocalDateTime getAtualizadoEM() {
        return atualizadoEM;
    }
    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        AgenciamentoResponseDTO that = (AgenciamentoResponseDTO) o;
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
                ", descricao='" + descricao + '\'' +
                ", tipoImovel=" + tipoImovel +
                ", status=" + status +
                ", valorVenda=" + valorVenda +
                ", cidade='" + cidade + '\'' +
                ", bairro='" + bairro + '\'' +
                ", rua='" + rua + '\'' +
                ", numero='" + numero + '\'' +
                ", complemento='" + complemento + '\'' +
                ", areaM2=" + areaM2 +
                ", quartos=" + quartos +
                ", banheiros=" + banheiros +
                ", vagasGaragem=" + vagasGaragem +
                ", criadoEM=" + criadoEM +
                ", atualizadoEM=" + atualizadoEM +
                '}';
    }
}
