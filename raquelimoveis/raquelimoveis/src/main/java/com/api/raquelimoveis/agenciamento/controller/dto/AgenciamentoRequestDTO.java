package com.api.raquelimoveis.agenciamento.controller.dto;

import com.api.raquelimoveis.agenciamento.enums.StatusAgenciamentos;
import com.api.raquelimoveis.agenciamento.enums.TipoImovel;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Component
public class AgenciamentoRequestDTO {
    private String codigoAgs;
    private String titulo;
    private String descricao;
    private TipoImovel tipoImovel;
    private StatusAgenciamentos status;
    private BigDecimal valorVenda;
    private String cidade;
    private String bairro;
    private String rua;
    private String numero;
    private String complemento;
    private BigDecimal areaM2;
    private Integer quartos;
    private Integer banheiros;
    private Integer vagasGaragem;
    private LocalDateTime criadoEM;
    private LocalDateTime atualizadoEM;

    public String getCodigoAgs() {
        return codigoAgs;
    }

    public void setCodigoAgs(String codigoAgs) {
        this.codigoAgs = codigoAgs;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public TipoImovel getTipoImovel() {
        return tipoImovel;
    }

    public void setTipoImovel(TipoImovel tipoImovel) {
        this.tipoImovel = tipoImovel;
    }

    public StatusAgenciamentos getStatus() {
        return status;
    }

    public void setStatus(StatusAgenciamentos status) {
        this.status = status;
    }

    public BigDecimal getValorVenda() {
        return valorVenda;
    }

    public void setValorVenda(BigDecimal valorVenda) {
        this.valorVenda = valorVenda;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getRua() {
        return rua;
    }

    public void setRua(String rua) {
        this.rua = rua;
    }

    public String getNumero() {
        return numero;
    }

    public void sewtNumero(String numero) {
        this.numero = numero;
    }

    public String getComplemento() {
        return complemento;
    }

    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }

    public BigDecimal getAreaM2() {
        return areaM2;
    }

    public void setAreaM2(BigDecimal areaM2) {
        this.areaM2 = areaM2;
    }

    public Integer getQuartos() {
        return quartos;
    }

    public void setQuartos(Integer quartos) {
        this.quartos = quartos;
    }

    public Integer getBanheiros() {
        return banheiros;
    }

    public void setBanheiros(Integer banheiros) {
        this.banheiros = banheiros;
    }

    public Integer getVagasGaragem() {
        return vagasGaragem;
    }

    public void setVagasGaragem(Integer vagasGaragem) {
        this.vagasGaragem = vagasGaragem;
    }

    public LocalDateTime getCriadoEM() {
        return criadoEM;
    }

    public void setCriadoEM(LocalDateTime criadoEM) {
        this.criadoEM = criadoEM;
    }

    public LocalDateTime getAtualizadoEM() {
        return atualizadoEM;
    }

    public void setAtualizadoEM(LocalDateTime atualizadoEM) {
        this.atualizadoEM = atualizadoEM;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        AgenciamentoRequestDTO that = (AgenciamentoRequestDTO) o;
        return Objects.equals(codigoAgs, that.codigoAgs);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(codigoAgs);
    }

    @Override
    public String toString() {
        return "AgenciamentoRequestDTO{" +
                "codigoAgs='" + codigoAgs + '\'' +
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
