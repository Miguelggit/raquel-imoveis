package com.api.usuario.dto;

import com.api.usuario.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsuarioRequestDTO {
    private String nome;
    private String email;
    private String senha;
    private Role role;
    private Boolean ativo;
}
