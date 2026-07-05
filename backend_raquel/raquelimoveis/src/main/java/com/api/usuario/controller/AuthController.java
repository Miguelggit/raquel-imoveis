package com.api.usuario.controller;

import com.api.usuario.dto.LoginRequestDTO;
import com.api.usuario.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> authLogin(@RequestBody LoginRequestDTO dtoLogin){
        return authService.authLoginWithCookie(dtoLogin.getEmail(), dtoLogin.getSenha());
    }
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> authLogout(){
        return authService.authLogout();
    }

}
