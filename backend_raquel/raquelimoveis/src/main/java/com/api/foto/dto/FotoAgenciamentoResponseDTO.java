package com.api.foto.dto;
import java.time.LocalDateTime;

public class FotoAgenciamentoResponseDTO {
    private Long id;

    private String nomeArquivo;

    private String nomeArmazenado;

    private String contentType;

    private Long tamanho;

    private String url;

    private Long agenciamentoId;

    private LocalDateTime criadoEM;

    public FotoAgenciamentoResponseDTO() {
    }

    public FotoAgenciamentoResponseDTO(Long id, String nomeArquivo, String nomeArmazenado, String contentType, Long tamanho, String url, Long agenciamentoId, LocalDateTime criadoEM) {
        this.id = id;
        this.nomeArquivo = nomeArquivo;
        this.nomeArmazenado = nomeArmazenado;
        this.contentType = contentType;
        this.tamanho = tamanho;
        this.url = url;
        this.agenciamentoId = agenciamentoId;
        this.criadoEM = criadoEM;
    }

    public Long getAgenciamentoId() {
        return agenciamentoId;
    }

    public void setAgenciamentoId(Long agenciamentoId) {
        this.agenciamentoId = agenciamentoId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCriadoEM() {
        return criadoEM;
    }

    public void setCriadoEM(LocalDateTime criadoEM) {
        this.criadoEM = criadoEM;
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

}
