package com.api.raquelimoveis.agenciamento.enums;

public enum StatusAgenciamentos {
    DISPONIVEL("Disponivel"),
    RESERVADO("Reservado"),
    VENDIDO("Vendido"),
    INATIVO("Inativo");

    public final  String status;

    StatusAgenciamentos(java.lang.String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}
