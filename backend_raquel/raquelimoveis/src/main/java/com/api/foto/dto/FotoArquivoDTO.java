package com.api.foto.dto;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

public class FotoArquivoDTO {
    private byte[] conteudo;
    private MediaType contentType;
    private HttpHeaders headers;

    public FotoArquivoDTO() {
    }

    public FotoArquivoDTO(byte[] conteudo, MediaType contentType, HttpHeaders headers) {
        this.conteudo = conteudo;
        this.contentType = contentType;
        this.headers = headers;
    }

    public byte[] getConteudo() {
        return conteudo;
    }

    public void setConteudo(byte[] conteudo) {
        this.conteudo = conteudo;
    }

    public void setContentType(MediaType contentType) {
        this.contentType = contentType;
    }

    public HttpHeaders getHeaders() {
        return headers;
    }

    public void setHeaders(HttpHeaders headers) {
        this.headers = headers;
    }

    public MediaType getContentType() {
        return contentType;
    }
}
