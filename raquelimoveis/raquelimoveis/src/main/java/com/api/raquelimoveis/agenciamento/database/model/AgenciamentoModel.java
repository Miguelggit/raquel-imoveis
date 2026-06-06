package com.api.raquelimoveis.agenciamento.database.model;

import com.api.raquelimoveis.agenciamento.enums.StatusAgenciamentos;
import com.api.raquelimoveis.agenciamento.enums.TipoImovel;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "TB_AGENCIAMENTOS")
public class AgenciamentoModel {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String codigoAgs;

    @Column(nullable = false, unique = false)
    @Size(min = 5, max = 150)
    private String titulo;

    @Column(nullable = true)
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private  TipoImovel tipoImovel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusAgenciamentos status;

    @DecimalMin(value = "1.00")
    @Column(nullable = false)
    private BigDecimal valorVenda;

    @Size(max = 100)
    @Column(nullable = false)
    private String cidade;

    @Size(max = 100)
    @Column(nullable = false)
    private String bairro;

    @Size(max = 150)
    @Column(nullable = true)
    private String rua;

    @Size(max = 20)
    @Column(nullable = true)
    private String numero;

    @Size(max = 100)
    @Column(nullable = true)
    private String complemento;

    @DecimalMin(value = "1.00")
    @Column(nullable = false)
    private BigDecimal areaM2;

    @Min(value = 0,message = "0")
    @Column(nullable = true)
    private Integer quartos;

    @Min(value = 0,message = "0")
    @Column(nullable = true)
    private Integer banheiros;

    @Min(value = 0,message = "0")
    @Column(nullable = true)
    private Integer vagasGaragem;

    @Column(name = "DT_HR_CRIADO")
    private LocalDateTime criadoEM;

    @PrePersist
    protected void onCreate(){
        this.criadoEM = LocalDateTime.now();
    }
    @Column(name = "DT_HR_ATUALIZADO")
    private LocalDateTime atualizadoEM;
    @PreUpdate
    protected void onUpdate() {
        this.atualizadoEM = LocalDateTime.now();
    }
    public AgenciamentoModel() {

    }
    @OneToMany(mappedBy = "agenciamentoModel", fetch = FetchType.LAZY)
    private Set<FotoModel> fotoModel;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Set<FotoModel> getFotoAgenciamentoModel() {
        return fotoModel;
    }

    public void setFotoAgenciamentoModel(Set<FotoModel> fotoModel) {
        this.fotoModel = fotoModel;
    }
}
