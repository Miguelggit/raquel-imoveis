package com.api.raquelimoveis.agenciamento.controller.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL) // Vai omitir todos os campos nulls
public record ErroResponseDTO(LocalDateTime timestmap,
                              int status,
                              String message,
                              String path,
                              List<FieldErrorDTO> fields) {
}
