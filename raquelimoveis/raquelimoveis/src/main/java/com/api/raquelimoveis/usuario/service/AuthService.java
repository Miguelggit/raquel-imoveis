package com.api.raquelimoveis.usuario.service;
import com.api.raquelimoveis.usuario.database.model.UsuarioModel;
import com.api.raquelimoveis.usuario.database.repository.UsuarioRepository;
import com.api.raquelimoveis.usuario.dto.LoginResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final   UsuarioRepository repository;
    private final   JwtTokenService tokenService;
    private final   PasswordEncoder encoder;
    private final   UserDetailsServiceImpl userDetailsService;

    public final LoginResponseDTO authLogin(String email, String password){
        UsuarioModel userByEmail = repository.findByEmail(email).get();
        if(!encoder.matches(password, userByEmail.getSenha())){
            throw new BadCredentialsException("Usuario e/ou senha estão invalidos!!");
        }
        String token = tokenService.generateToken(userByEmail);
        return new LoginResponseDTO(token, "Bearer", userByEmail.getEmail(), userByEmail.getNome());

    }
}
