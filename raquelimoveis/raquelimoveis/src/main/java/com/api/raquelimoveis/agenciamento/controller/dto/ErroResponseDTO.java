package com.api.raquelimoveis.agenciamento.controller.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ErroResponseDTO(LocalDateTime timestmap,
                              int status,
                              String message,
                              String path,
                              List<FieldErrorDTO> fields) {
}
