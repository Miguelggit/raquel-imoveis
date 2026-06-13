package com.api.agenciamento.controller.dto;

import com.api.agenciamento.enums.StatusAgenciamentos;
import com.api.agenciamento.enums.TipoImovel;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class AgenciamentoRequestDTO {
    @NotBlank
    @Size(min = 5, max = 150)
    private String titulo;
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

    public void setNumero(String numero) {
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

    @Override
    public String toString() {
        return "AgenciamentoRequestDTO{" +
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
                '}';
    }
}
