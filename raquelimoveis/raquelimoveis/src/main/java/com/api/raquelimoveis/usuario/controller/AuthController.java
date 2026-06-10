package com.api.raquelimoveis.usuario.controller;

import com.api.raquelimoveis.usuario.dto.LoginRequestDTO;
import com.api.raquelimoveis.usuario.dto.LoginResponseDTO;
import com.api.raquelimoveis.usuario.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> authLogin(@RequestBody LoginRequestDTO dtoLogin){

        return ResponseEntity.status(HttpStatus.OK).body(authService.authLogin(dtoLogin.getEmail(), dtoLogin.getSenha()));

    }

}
