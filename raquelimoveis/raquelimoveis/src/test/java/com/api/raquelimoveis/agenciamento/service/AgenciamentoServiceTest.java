package com.api.raquelimoveis.agenciamento.service;

import com.api.raquelimoveis.agenciamento.database.repository.AgenciamentoRepository;
import com.api.raquelimoveis.agenciamento.mapper.AgenciamentoMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.assertEquals;
@ExtendWith(MockitoExtension.class) // Faz a inicialização dos mocks
class AgenciamentoServiceTest {
    @Mock // Mockando os atributos
    private AgenciamentoRepository repository;
    @Mock
    private AgenciamentoMapper mapper;
    @InjectMocks
    private AgenciamentoService service;

    @Test
    @DisplayName("Deve retornar AGS-001 quando não existir nenhum código no banco")
    public void geradorDeCodigoAGSCase1() {
        String input = null;
        String test = service.geradorDeCodigoAGS(input);
        assertEquals("AGS-001", test);
    }

    @Test
    @DisplayName("Deve dar sequencia no numeral recebendo AGS-001 e retornando AGS-002")
    void geradorDeCodigoAGSCase2() {
        String input = "AGS-001";
        String test = service.geradorDeCodigoAGS(input);
        assertEquals("AGS-002", test);
    }
    @Test
    @DisplayName("Deve receber AGS-099 e retornar AGS-100")
    void geradorDeCodigoAGSCase3(){
        String input = "AGS-099";
        String test = service.geradorDeCodigoAGS(input);
        assertEquals("AGS-100", test);
    }

}