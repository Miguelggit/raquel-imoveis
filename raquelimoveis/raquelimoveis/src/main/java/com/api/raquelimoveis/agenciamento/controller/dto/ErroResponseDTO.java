package com.api.raquelimoveis.agenciamento.exceptions;

import java.time.LocalDateTime;

public record ErroResponse(LocalDateTime timestmap,
                           int status,
                           String message) {
}
