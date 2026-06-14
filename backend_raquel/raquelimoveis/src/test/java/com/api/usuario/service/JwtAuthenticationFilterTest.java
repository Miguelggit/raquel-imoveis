package com.api.usuario.service;

import com.api.usuario.database.model.UsuarioModel;
import com.api.usuario.enums.Role;
import com.auth0.jwt.exceptions.JWTVerificationException;
import jakarta.servlet.ServletException;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.mock.http.server.reactive.MockServerHttpRequest.get;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {
    @Nested
    class JwtAuthenticationFilterTests {

        @Mock
        private JwtTokenService tokenService;
        @Mock
        private UserDetailsServiceImpl userDetailsService;
        @InjectMocks
        private JwtAuthenticationFilter authFilter;

        @Test
        @DisplayName("Deve autenticar caso o token seja valido")
        void deveAutenticar_quandoTokenValido() throws ServletException, IOException {
            MockHttpServletRequest request = new MockHttpServletRequest();
            request.addHeader("Authorization", "Bearer TOKEN-COM-32CARACTERES-VALIDO");
            MockHttpServletResponse response = new MockHttpServletResponse();
            MockFilterChain filterChain = new MockFilterChain();
            UsuarioModel model = new UsuarioModel();
            model.setRole(Role.ADMIN);
            model.setEmail("mock@mock.com.br");
            lenient().when(tokenService.validationToken("TOKEN-COM-32CARACTERES-VALIDO")).thenReturn(model.getEmail());
            when(userDetailsService.loadUserByUsername(model.getEmail())).thenReturn(new UserDetailsImpl(model));

            authFilter.doFilterInternal(request, response, filterChain);

            assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        }
        @Test
        @DisplayName("Deve rejeitar quando não possuir token")
        void deveRejeitar_quandoTokenAusente() throws ServletException, IOException {
            MockHttpServletRequest request = new MockHttpServletRequest();
            MockHttpServletResponse response = new MockHttpServletResponse();
            MockFilterChain filterChain = new MockFilterChain();

            authFilter.doFilter(request, response, filterChain);

            assertNull(SecurityContextHolder.getContext().getAuthentication());

        }
        @Test
        @DisplayName("Deve rejeitar quando o token estiver expirado")
        void deveRejeitar_quandoTokenExpirado() throws ServletException, IOException {
            MockHttpServletRequest request = new MockHttpServletRequest();
            MockHttpServletResponse response = new MockHttpServletResponse();
            MockFilterChain filterChain = new MockFilterChain();
            request.addHeader("Authorization", "Bearer token-expirado");
            when(tokenService.validationToken("token-expirado")).thenThrow(new JWTVerificationException("Token expirado"));

            authFilter.doFilter(request, response, filterChain);

            assertNull(SecurityContextHolder.getContext().getAuthentication());
        }
        @Test
        @DisplayName("Deve rejeitar quando o token for invalido")
        void deveRejeitar_quandoTokenInvalido() throws ServletException, IOException {
            MockHttpServletRequest request = new MockHttpServletRequest();
            MockHttpServletResponse response = new MockHttpServletResponse();
            MockFilterChain filterChain = new MockFilterChain();
            request.addHeader("Authorization", "Bearer token-invalido");
            when(tokenService.validationToken("token-invalido")).thenThrow(new JWTVerificationException("Token invalido"));

            authFilter.doFilter(request, response, filterChain);

            assertNull(SecurityContextHolder.getContext().getAuthentication());
        }
    }
}