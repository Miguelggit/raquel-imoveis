package com.api.usuario.controller;

import com.api.usuario.dto.LoginRequestDTO;
import com.api.usuario.dto.LoginResponseDTO;
import com.api.usuario.service.AuthService;
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
