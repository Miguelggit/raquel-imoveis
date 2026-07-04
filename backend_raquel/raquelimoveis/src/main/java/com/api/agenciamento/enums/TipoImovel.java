package com.api.agenciamento.enums;

public enum TipoImovel {
    CASA("Casa"),
    APARTAMENTO("Apartamento"),
    SOBRADO("Sobrado"),
    LOFT("Loft"),
    TERRENO("Terreno"),
    COBERTURA("Cobertura"),
    CASA_GERMINADA("Casa Germinada");

    private final String tipo;

    TipoImovel(String tipo) {
        this.tipo = tipo;
    }

    public String getTipo() {
        return tipo;
    }
}
