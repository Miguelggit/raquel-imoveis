package com.api.usuario.config;

import com.jayway.jsonpath.JsonPath;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    private String obeterToken() throws Exception {
        String response = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"raquel@raquelimoveis.com.br\",\"senha\":\"senha123\"}"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        return JsonPath.read(response, "$.token");
    }

    @Test
    @DisplayName("Deve permitir o acesso quando o endpoint for publico")
    void devePermitirAcesso_quandoEndpointPublicoSemToken() throws Exception {
        mockMvc.perform(get("/api/agenciamentos"))
                .andExpect(status().isOk());
    }
    @Test
    @DisplayName("Deve bloquear o acesso quando o endpoint chamado for protegido")
    void deveBloquearAcesso_quandoEndpointProtegidoSemToken() throws Exception {
        mockMvc.perform(post("/api/agenciamentos"))
                .andExpect(status().isUnauthorized());
    }
    @Test
    @DisplayName("Deve permitir o acesso quando o token tiver valido")
    void devePermitirAcesso_quandoEndpointProtegidoComTokenValido() throws Exception {
        String token = obeterToken();

        mockMvc.perform(post("/api/agenciamentos")
                .header("Authorization", "Bearer "+ token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"titulo\":\"Casa teste\",\"tipoImovel\":\"CASA\",\"valorVenda\":500000}"))
                .andExpect(result -> result.getResponse().getStatus());
    }
    @Test
    @DisplayName("Deve bloquear o delte caso não possua o token")
    void deveBloquearDelete_semToken() throws Exception {
        mockMvc.perform(delete("/api/agenciamentos/fotos/1"))
                .andExpect(status().isUnauthorized());
    }
    @Test
    @DisplayName("Deve permitir login sem tokén")
    void devePermitirLogin_semToken() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"raquel@raquelimoveis.com.br\",\"senha\":\"senha123\"}"))
                .andExpect(status().isOk());
    }
    @Test
    @DisplayName("Deve retornar 401 caso as credenciais estejam invalidas")
    void deveRetornar401_quandoCredenciaisInvalidas() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"raquel@raquelimoveis.com.br\",\"senha\":\"senha1223\"}"))
                .andExpect(status().isUnauthorized());
    }
}

