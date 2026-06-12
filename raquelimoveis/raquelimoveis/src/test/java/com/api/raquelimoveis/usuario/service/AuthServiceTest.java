package com.api.raquelimoveis.usuario.service;

import com.api.raquelimoveis.usuario.database.model.UsuarioModel;
import com.api.raquelimoveis.usuario.database.repository.UsuarioRepository;
import com.api.raquelimoveis.usuario.dto.LoginResponseDTO;
import exceptions.IdentificadorNaoEncontradoException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository repository;
    @Mock
    private JwtTokenService tokenService;
    @Mock
    private  PasswordEncoder encoder;
    @Mock
    private UserDetailsServiceImpl userDetailsService;
    @InjectMocks
    private AuthService service;
    @Test
    @DisplayName("Devera retornar um token caso as credenciais estejam certas")
    void deveRetornarToken_quandoCredenciaisValidas() {
        String email = "raquel@raquelimoveis.com.br";
        String senha = "senha123";
        UsuarioModel model = new UsuarioModel();
        model.setEmail(email);
        model.setNome("Raquel");
        model.setSenha("senhaEncoded");
        lenient().when(userDetailsService.findEmail(email)).thenReturn(model);
        lenient().when(encoder.matches(senha, model.getSenha())).thenReturn(true);
        lenient().when(tokenService.generateToken(any(UsuarioModel.class))).thenReturn("token-mock");
        LoginResponseDTO loginResponseDTO = service.authLogin(email, senha);
        assertNotNull(loginResponseDTO);
        verify(userDetailsService).findEmail(email);
        verify(tokenService).generateToken(model);
    }
    @Test
    @DisplayName("Deve lançar um erro caso o Email não exista")
    void deveLancarExcecao_quandoEmailNaoExistir(){
        String email = "miguel@dev.com";
        String senha = "senha123";
        UsuarioModel model = new UsuarioModel();
        model.setEmail(email);
        model.setNome("Miguel");
        model.setSenha("BYCript");
        when(userDetailsService.findEmail(email)).thenThrow(new IdentificadorNaoEncontradoException("O username não foi encontrado"));
        IdentificadorNaoEncontradoException response = assertThrows(
                IdentificadorNaoEncontradoException.class,
                () -> service.authLogin(model.getEmail(), model.getSenha())
        );
        assertEquals("O username não foi encontrado", response.getMessage());
        verify(userDetailsService).findEmail(email);
    }
    @Test
    @DisplayName("Deve lançar exceção se a senha for invalida")
    void deveLancarExcecao_quandoSenhaForInvalida(){
        UsuarioModel model = new UsuarioModel();
        model.setEmail("miguel@dev.com.br");
        model.setSenha("senhaju");
        model.setNome("Miguel");
       lenient().when(userDetailsService.findEmail(model.getEmail())).thenReturn(model);
        lenient().when(encoder.matches("jubileu123", model.getSenha())).thenThrow(new BadCredentialsException("Usuario e/ou senha estão invalidos!!"));
        BadCredentialsException response = assertThrows(
                BadCredentialsException.class,
                () -> service.authLogin(model.getEmail(), model.getSenha())
        );
        assertEquals("Usuario e/ou senha estão invalidos!!", response.getMessage());
        verify(encoder, never()).matches("jubileu123", model.getSenha());
    }
}