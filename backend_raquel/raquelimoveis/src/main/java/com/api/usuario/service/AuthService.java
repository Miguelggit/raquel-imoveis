package com.api.usuario.service;
import com.api.usuario.database.model.UsuarioModel;
import com.api.usuario.database.repository.UsuarioRepository;
import com.api.usuario.dto.LoginResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final   UsuarioRepository repository;
    private final   JwtTokenService tokenService;
    private final   PasswordEncoder encoder;
    private final   UserDetailsServiceImpl userDetailsService;

    // false em dev (HTTP na rede local); true em produção (HTTPS).
    @Value("${app.cookie.secure:true}")
    private boolean cookieSecure;

    public LoginResponseDTO authLogin(String email, String password){
        UsuarioModel userByEmail = userDetailsService.findEmail(email);
        if(!encoder.matches(password, userByEmail.getSenha())){
            throw new BadCredentialsException("Usuario e/ou senha estão invalidos!!");
        }
        String token = tokenService.generateToken(userByEmail);
        ResponseCookie cookie = ResponseCookie.from("token", token)
                        .httpOnly(true)
                        .secure(true)
                        .maxAge(Duration.ofHours(8))
                        .build();

        ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("nome", userByEmail.getEmail()));

    return new LoginResponseDTO(token, "Bearer", userByEmail.getEmail(), userByEmail.getNome());

    }
    public ResponseEntity<Map<String, String>> authLoginWithCookie(String email, String password){
        UsuarioModel userByEmail = userDetailsService.findEmail(email);
        if(!encoder.matches(password, userByEmail.getSenha())){
            throw new BadCredentialsException("Usuario e/ou senha estão invalidos!!");
        }
        String token = tokenService.generateToken(userByEmail);

        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofHours(8))
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("username", userByEmail.getEmail()));
    }

    public ResponseEntity<Map<String, String>> authLogout(){
        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true).secure(cookieSecure).sameSite("Strict").path("/")
                .maxAge(0).build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }

}
