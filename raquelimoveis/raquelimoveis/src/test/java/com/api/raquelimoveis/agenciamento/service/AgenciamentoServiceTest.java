package com.api.raquelimoveis.agenciamento.service;

import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoRequestDTO;
import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoResponseDTO;
import com.api.raquelimoveis.agenciamento.database.model.AgenciamentoModel;
import com.api.raquelimoveis.agenciamento.database.repository.AgenciamentoRepository;
import com.api.raquelimoveis.agenciamento.enums.StatusAgenciamentos;
import com.api.raquelimoveis.agenciamento.enums.TipoImovel;
import com.api.raquelimoveis.agenciamento.exceptions.CadastroDeStatusException;
import com.api.raquelimoveis.agenciamento.mapper.AgenciamentoMapper;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AgenciamentoServiceTest {
    @Mock
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
    @Test
    @DisplayName("Deve cadastrar um novo agenciamento com o status DISPONIVEL")
    void cadastrarAgenciamentoCase1() {
        AgenciamentoRequestDTO requestDTO = new AgenciamentoRequestDTO();
        requestDTO.setTitulo("Casa no Lourdes com piscina");
        requestDTO.setDescricao("Casa em condomínio fechado com portaria 24h");
        requestDTO.setTipoImovel(TipoImovel.CASA);
        requestDTO.setValorVenda(new BigDecimal(680000));
        requestDTO.setCidade("Caxias do Sul");
        requestDTO.setBairro("Lourdes");
        requestDTO.setRua("Rua das Hortênsias");
        requestDTO.setNumero("420");
        requestDTO.setAreaM2(new BigDecimal(180));
        requestDTO.setQuartos(3);
        requestDTO.setBanheiros(2);
        requestDTO.setVagasGaragem(1);
        Mockito.when(repository.findMaxCodigoAgs()).thenReturn(null);
        Mockito.when(repository.save(any())).thenReturn(new AgenciamentoModel());
        Mockito.when(mapper.converterParaModel(any())).thenReturn(new AgenciamentoModel());
        Mockito.when(mapper.converterParaDTO(any())).thenReturn(new AgenciamentoResponseDTO());
        service.cadastrarAgenciamento(requestDTO);
        ArgumentCaptor<AgenciamentoModel> captor = ArgumentCaptor.forClass(AgenciamentoModel.class);
        assertEquals(StatusAgenciamentos.DISPONIVEL, requestDTO.getStatus());
        verify(repository).save(captor.capture());
        assertEquals("AGS-001", captor.getValue().getCodigoAgs());
    }
    @Test
    @DisplayName("Deve fazer o cadastro do Agenciamento mesmo o status sendo como RESERVADO")
    void deveCadastrarComSucesso_quandoStatusForReservado(){
        AgenciamentoRequestDTO requestDTO = new AgenciamentoRequestDTO();
        requestDTO.setTitulo("Casa no Lourdes com piscina");
        requestDTO.setDescricao("Casa em condomínio fechado com portaria 24h");
        requestDTO.setTipoImovel(TipoImovel.CASA);
        requestDTO.setValorVenda(new BigDecimal(680000));
        requestDTO.setCidade("Caxias do Sul");
        requestDTO.setBairro("Lourdes");
        requestDTO.setRua("Rua das Hortênsias");
        requestDTO.setNumero("420");
        requestDTO.setAreaM2(new BigDecimal(180));
        requestDTO.setQuartos(3);
        requestDTO.setBanheiros(2);
        requestDTO.setVagasGaragem(1);
        requestDTO.setStatus(StatusAgenciamentos.RESERVADO);
        Mockito.when(repository.findMaxCodigoAgs()).thenReturn("AGS-001");
        Mockito.when(repository.save(any())).thenReturn(new AgenciamentoModel());
        Mockito.when(mapper.converterParaModel(any())).thenReturn(new AgenciamentoModel());
        Mockito.when(mapper.converterParaDTO(any())).thenReturn(new AgenciamentoResponseDTO());
        service.cadastrarAgenciamento(requestDTO);
        ArgumentCaptor<AgenciamentoModel> captor = ArgumentCaptor.forClass(AgenciamentoModel.class);
        assertEquals(StatusAgenciamentos.RESERVADO, requestDTO.getStatus());
        verify(repository).save(captor.capture());
        assertEquals("AGS-002", captor.getValue().getCodigoAgs());
    }
    @Test
    @DisplayName("Lança uma exceção caso o status for INATIVO")
    void deveLancarExcecao_quandoStatusForInativo(){
        AgenciamentoRequestDTO requestDTO = new AgenciamentoRequestDTO();
        requestDTO.setStatus(StatusAgenciamentos.INATIVO);
        CadastroDeStatusException ex = assertThrows(CadastroDeStatusException.class, () ->
                service.cadastrarAgenciamento(requestDTO
        ));
        assertEquals("Este status não pode ser cadastrado", ex.getMessage());
        ArgumentCaptor<AgenciamentoModel> captor = ArgumentCaptor.forClass(AgenciamentoModel.class);
        verify(repository, Mockito.never()).save(any());
    }
    @Test
    @DisplayName("Lança uma exceção caso o status for VENDIDO")
    void deveLancarExcecao_quandoStatusForVendido(){
        AgenciamentoRequestDTO rqDTO = new AgenciamentoRequestDTO();
        rqDTO.setStatus(StatusAgenciamentos.VENDIDO);
        CadastroDeStatusException excecao = assertThrows(CadastroDeStatusException.class, () -> {
            service.cadastrarAgenciamento(rqDTO);
        });
        assertEquals("Este status não pode ser cadastrado", excecao.getMessage());
        verify(repository, Mockito.never()).save(any());
    }
    @Test
    @DisplayName("Deve gerar um novo codigo ao ser cadastrado um novo agenciamento")
    void deveGerarCodigoAgs_quandoCadastrarNovoAgenciamento(){
        AgenciamentoRequestDTO requestDTO = new AgenciamentoRequestDTO();
        requestDTO.setTitulo("Casa no Lourdes com piscina");
        requestDTO.setDescricao("Casa em condomínio fechado com portaria 24h");
        requestDTO.setTipoImovel(TipoImovel.CASA);
        requestDTO.setValorVenda(new BigDecimal(680000));
        requestDTO.setCidade("Caxias do Sul");
        requestDTO.setBairro("Lourdes");
        requestDTO.setRua("Rua das Hortênsias");
        requestDTO.setNumero("420");
        requestDTO.setAreaM2(new BigDecimal(180));
        requestDTO.setQuartos(3);
        requestDTO.setBanheiros(2);
        requestDTO.setVagasGaragem(1);
        Mockito.when(repository.findMaxCodigoAgs()).thenReturn("AGS-034");
        Mockito.when(repository.save(any())).thenReturn(new AgenciamentoModel());
        Mockito.when(mapper.converterParaModel(any())).thenReturn(new AgenciamentoModel());
        Mockito.when(mapper.converterParaDTO(any())).thenReturn(new AgenciamentoResponseDTO());
        service.cadastrarAgenciamento(requestDTO);
        ArgumentCaptor<AgenciamentoModel> captor = ArgumentCaptor.forClass(AgenciamentoModel.class);
        verify(repository).save(captor.capture());
        assertEquals("AGS-035", captor.getValue().getCodigoAgs());
    }
}