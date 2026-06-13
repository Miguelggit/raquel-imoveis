package com.api.usuario.dto;

public record LoginResponseDTO(String token, String tipo, String email, String nome) {
}
