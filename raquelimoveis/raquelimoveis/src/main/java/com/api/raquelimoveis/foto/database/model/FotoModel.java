package com.api.raquelimoveis.foto.database.model;

import com.api.raquelimoveis.agenciamento.database.model.AgenciamentoModel;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "TB_FOTOS")
public class FotoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "nome_do_arquivo", nullable = false)
    private String nomeArquivo;
    @Column(name = "nome_armazenado", nullable = false, unique = true)
    private String nomeArmazenado;
    @Column(name = "tipo_de_imagem", nullable = false)
    private String contentType;
    @Column(name = "tamanho_do_arquivo", nullable = false)
    private Long tamanho;
    @Column(name = "URL", nullable = false)
    private String url;
    @ManyToOne
    @JoinColumn(name = "agenciamento_id", nullable = false) // Da o nome para a coluna com o relacionamento
    private AgenciamentoModel agenciamentoModel;
    @Column(name = "DT_HR_CRIADO")
    private LocalDateTime criadoEM;
    @PrePersist
    protected void onCreate(){this.criadoEM = LocalDateTime.now();

    }

    public FotoModel() {

    }

    public FotoModel(String nomeArquivo, String nomeArmazenado, String contentType, Long tamanho, String url, AgenciamentoModel agenciamentoModel, LocalDateTime criadoEM) {
        this.nomeArquivo = nomeArquivo;
        this.nomeArmazenado = nomeArmazenado;
        this.contentType = contentType;
        this.tamanho = tamanho;
        this.url = url;
        this.agenciamentoModel = agenciamentoModel;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeArquivo() {
        return nomeArquivo;
    }

    public void setNomeArquivo(String nomeArquivo) {
        this.nomeArquivo = nomeArquivo;
    }

    public String getNomeArmazenado() {
        return nomeArmazenado;
    }

    public void setNomeArmazenado(String nomeArmazenado) {
        this.nomeArmazenado = nomeArmazenado;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Long getTamanho() {
        return tamanho;
    }

    public void setTamanho(Long tamanho) {
        this.tamanho = tamanho;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public AgenciamentoModel getAgenciamentoModel() {
        return agenciamentoModel;
    }

    public void setAgenciamentoModel(AgenciamentoModel agenciamentoModel) {
        this.agenciamentoModel = agenciamentoModel;
    }

    public LocalDateTime getCriadoEM() {
        return criadoEM;
    }

    public void setCriadoEM(LocalDateTime criadoEM) {
        this.criadoEM = criadoEM;
    }
}
