package com.api.usuario.service;
import com.api.usuario.database.model.UsuarioModel;
import com.api.usuario.database.repository.UsuarioRepository;
import com.api.usuario.dto.LoginResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final   UsuarioRepository repository;
    private final   JwtTokenService tokenService;
    private final   PasswordEncoder encoder;
    private final   UserDetailsServiceImpl userDetailsService;

    public LoginResponseDTO authLogin(String email, String password){
        UsuarioModel userByEmail = userDetailsService.findEmail(email);
        if(!encoder.matches(password, userByEmail.getSenha())){
            throw new BadCredentialsException("Usuario e/ou senha estão invalidos!!");
        }
        String token = tokenService.generateToken(userByEmail);
        return new LoginResponseDTO(token, "Bearer", userByEmail.getEmail(), userByEmail.getNome());

    }
}
