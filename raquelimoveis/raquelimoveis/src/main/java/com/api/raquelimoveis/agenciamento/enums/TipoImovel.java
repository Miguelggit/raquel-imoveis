package com.api.raquelimoveis.agenciamento.enums;

public enum TipoImovel {
    CASA("Casa"),
    APARTAMENTO("Apartamento"),
    SOBRADO("Sobrado"),
    LOFT("Loft"),
    TERRENO("Terreno"),
    CASA_GERMINADA("Casa Germinada");

    private final String tipo;

    TipoImovel(String tipo) {
        this.tipo = tipo;
    }

    public String getTipo() {
        return tipo;
    }
}
