package com.api.usuario.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@RequiredArgsConstructor
public class LoginRequestDTO {
    private String email;
    private String  senha;
}
