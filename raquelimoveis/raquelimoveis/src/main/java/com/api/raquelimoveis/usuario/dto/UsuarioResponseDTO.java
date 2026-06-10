package com.api.raquelimoveis.usuario.dto;

import com.api.raquelimoveis.usuario.enums.Role;
import java.time.LocalDateTime;
import java.util.UUID;

public record UsuarioResponseDTO(UUID id,
                                 String nome,
                                 String email,
                                 String senha,
                                 Role role,
                                 Boolean ativo,
                                 LocalDateTime criadoEM) {
}
