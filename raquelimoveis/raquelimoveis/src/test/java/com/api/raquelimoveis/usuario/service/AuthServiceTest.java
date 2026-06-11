package com.api.raquelimoveis.usuario.service;

import com.api.raquelimoveis.usuario.database.repository.UsuarioRepository;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

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

}