package com.api.agenciamento.service;

import com.api.agenciamento.controller.dto.AgenciamentoPageResponseDTO;
import com.api.agenciamento.controller.dto.AgenciamentoRequestDTO;
import com.api.agenciamento.controller.dto.AgenciamentoResponseDTO;
import com.api.agenciamento.controller.dto.AgenciamentoResponseSemDetalhesDTO;
import com.api.agenciamento.database.model.AgenciamentoModel;
import com.api.agenciamento.database.repository.AgenciamentoRepository;
import com.api.agenciamento.enums.StatusAgenciamentos;
import com.api.agenciamento.enums.TipoImovel;
import com.api.exceptions.CadastroDeStatusException;
import com.api.exceptions.IdentificadorNaoEncontradoException;
import com.api.exceptions.InativarAgenciamentoException;
import com.api.agenciamento.mapper.AgenciamentoMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

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
    @DisplayName("Permite cadastrar como INATIVO (rascunho oculto enquanto as fotos são adicionadas)")
    void devePermitirCadastro_quandoStatusForInativo(){
        AgenciamentoRequestDTO requestDTO = new AgenciamentoRequestDTO();
        requestDTO.setStatus(StatusAgenciamentos.INATIVO);
        Mockito.when(repository.findMaxCodigoAgs()).thenReturn("AGS-001");
        Mockito.when(mapper.converterParaModel(any())).thenReturn(new AgenciamentoModel());
        Mockito.when(repository.save(any())).thenReturn(new AgenciamentoModel());
        Mockito.when(mapper.converterParaDTO(any())).thenReturn(new AgenciamentoResponseDTO());

        service.cadastrarAgenciamento(requestDTO);

        assertEquals(StatusAgenciamentos.INATIVO, requestDTO.getStatus());
        verify(repository).save(any());
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
    @Test
    @DisplayName("Deve retornar o Agenciamentio caso exista o ID no banco")
    void deveRetornarAgenciamento_quandoIdExistir(){
        AgenciamentoResponseDTO response = new AgenciamentoResponseDTO();
        AgenciamentoModel model = new AgenciamentoModel();
        model.setId(1L);
        model.setTitulo("Casa no Lourdes com piscina");
        model.setDescricao("Casa em condomínio fechado com portaria 24h");
        model.setTipoImovel(TipoImovel.CASA);
        model.setValorVenda(new BigDecimal(680000));
        model.setCidade("Caxias do Sul");
        model.setBairro("Lourdes");
        model.setRua("Rua das Hortênsias");
        model.setNumero("420");
        model.setAreaM2(new BigDecimal(180));
        model.setQuartos(3);
        model.setBanheiros(2);
        model.setVagasGaragem(1);
        model.setStatus(StatusAgenciamentos.RESERVADO);
        Mockito.when(repository.findById(1L)).thenReturn(Optional.of(model));
        Mockito.when(mapper.converterParaDTO(any())).thenReturn(new AgenciamentoResponseDTO());
        response = service.listarPorId(1L);
        assertNotNull(response);
        verify(repository).findById(1L);
    }
    @Test
    @DisplayName("Lança uma exceção csao o ID não seja encontrado")
    void deveLancarExcecao_quandoIdNaoExistir(){
        Long idTestCase = 99L;
        Mockito.when(repository.findById(idTestCase)).thenReturn(Optional.empty());
        IdentificadorNaoEncontradoException excecao = assertThrows(IdentificadorNaoEncontradoException.class, () -> {
            service.buscarAgenciamentoPorId(idTestCase);
        });
        assertEquals("O ID: " +  idTestCase + " não foi encontrado", excecao.getMessage());
        verify(repository, Mockito.never()).save(any());
    }
    @Test
    @DisplayName("Deve buscar todos os agenciamentos que não são inativos")
    void deveRetornarAgsSemInativos_quandoExistirAgenciamentos() {
        List<AgenciamentoResponseSemDetalhesDTO> listResponse = new ArrayList<>();
        AgenciamentoModel model1 = new AgenciamentoModel();
        model1.setStatus(StatusAgenciamentos.INATIVO);
        AgenciamentoModel model2 = new AgenciamentoModel();
        model2.setStatus(StatusAgenciamentos.RESERVADO);
        AgenciamentoModel model3 = new AgenciamentoModel();
        model3.setStatus(StatusAgenciamentos.DISPONIVEL);
        AgenciamentoModel model4 = new AgenciamentoModel();
        model4.setStatus(StatusAgenciamentos.DISPONIVEL);
        List<AgenciamentoModel> lisModel = new ArrayList<>(List.of(model1, model2, model3, model4));
        Mockito.when(repository.findAll()).thenReturn(lisModel);
        Mockito.when(mapper.converterParaDTOSemDetalhes(any())).thenReturn(new AgenciamentoResponseSemDetalhesDTO());
        listResponse = service.listarTodosAgs();
        assertEquals(3, listResponse.size());
    }
    @Test
    @DisplayName("Deve retornar uma lsita vazia caso não tenha nenhum cadastro de Agenciamentos")
    void deveRetornarListaVazia_quandoNaoExistirAgenciamentos(){
        List<AgenciamentoResponseSemDetalhesDTO> listResponse =  new ArrayList<>();
        List<AgenciamentoModel> listAgs = new ArrayList<>();
        when(repository.findAll()).thenReturn(listAgs);
        listResponse = service.listarTodosAgs();
        assertTrue(listResponse.isEmpty());
    }
    @Test
    @DisplayName("Deve editar os dados do agenciamento cadastrado")
    void deveEditarComSucesso_qunadoIdExistir(){
        AgenciamentoRequestDTO request = new AgenciamentoRequestDTO();
        request.setTitulo("Casa no Lourdes com piscina");
        request.setDescricao("Casa em condomínio fechado com portaria 24h");
        request.setTipoImovel(TipoImovel.CASA);
        request.setValorVenda(new BigDecimal(680000));
        request.setCidade("Caxias do Sul");
        request.setBairro("Lourdes");
        request.setRua("Rua das Hortênsias");
        request.setNumero("420");
        request.setAreaM2(new BigDecimal(180));
        request.setQuartos(3);
        request.setBanheiros(2);
        request.setVagasGaragem(1);
        request.setStatus(StatusAgenciamentos.DISPONIVEL);
        AgenciamentoModel model = new AgenciamentoModel();
        model.setId(1L);
        when(repository.findById(1L)).thenReturn(Optional.of(model));
        when(repository.save(any())).thenReturn(model);
        when(mapper.converterParaDTO(any())).thenReturn(new AgenciamentoResponseDTO());
        AgenciamentoResponseDTO response = service.editarAgenciamento(1L, request);
        assertNotNull(response);
        verify(repository).save(any());
    }
    @Test
    @DisplayName("Lança exceção caso o ID não seja encontrado quando for editar um Agenciamento")
    void deveLancarExcecao_quandoIdNaoExistirNoEdit(){
        AgenciamentoRequestDTO dto = new AgenciamentoRequestDTO();
        when(repository.findById(1L)).thenReturn(Optional.empty());
        IdentificadorNaoEncontradoException excecao = assertThrows(IdentificadorNaoEncontradoException.class, () -> {
            service.editarAgenciamento(1L, dto);
        });
        assertEquals("O ID: " +  1L  + " não foi encontrado", excecao.getMessage());
    }
    @Test
    @DisplayName("Deve inativar o agenciamento caso exista")
    void deveInativarAgenciamento_quandoIdExistir(){
        AgenciamentoModel model = new AgenciamentoModel();
        model.setStatus(StatusAgenciamentos.DISPONIVEL);
        when(repository.findById(1L)).thenReturn(Optional.of(model));
        service.softDelete(1L);
        verify(repository).save(any());
        assertEquals(StatusAgenciamentos.INATIVO, model.getStatus());
    }
    @Test
    @DisplayName("Lança excecao caso o ID não exista no soft delete")
    void deveLancarExcecao_qunadoIdNaoExistirNoDelete(){
        when(repository.findById(99L)).thenReturn(Optional.empty());
        IdentificadorNaoEncontradoException excecao = assertThrows(IdentificadorNaoEncontradoException.class, () -> {
            service.softDelete(99L);
        });
        assertEquals("O ID: " + 99L + " não foi encontrado", excecao.getMessage());
    }
    @Test
    @DisplayName("Lança exceção quando o agenciamento já for INATIVO")
    void deveLancarExcecao_quandoAgenciamentoForInativo(){
        AgenciamentoModel model = new AgenciamentoModel();
        model.setStatus(StatusAgenciamentos.INATIVO);
        when(repository.findById(22L)).thenReturn(Optional.of(model));
        InativarAgenciamentoException excecao = assertThrows(InativarAgenciamentoException.class, () -> {
            service.softDelete(22L);
        });
        assertEquals("ID: "+ 22L + " já esta INATIVO", excecao.getMessage());
    }
    @Test
    @DisplayName("Deve retornar uma consulta paginada caso os filtros sejam nulos")
    void deveRetornarPaginado_quandoFitlrosForemNulos() {
        List<AgenciamentoModel> lista = List.of(new AgenciamentoModel(), new AgenciamentoModel());
        Page<AgenciamentoModel> responsePage = new PageImpl<>(lista);
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(responsePage);
        when(mapper.converterPageParaDTO(any())).thenReturn(new AgenciamentoPageResponseDTO());
        AgenciamentoPageResponseDTO filtros = service.filtros(null, null, null, null, null, null, null, null, false, PageRequest.of(0, 12));
        assertNotNull(filtros);
        verify(repository).findAll(any(Specification.class), any(Pageable.class));
    }
    @Test
    @DisplayName("Deve retornar um objeto filtrado caso seja passado um tipo de imovel")
    void deveRetornarFiltrado_quandoTipoImovelInformado(){
        List<AgenciamentoModel> listaAGS = List.of(new AgenciamentoModel(), new AgenciamentoModel());
        Page<AgenciamentoModel> page = new PageImpl<>(listaAGS);
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);
        when(mapper.converterPageParaDTO(any())).thenReturn(new AgenciamentoPageResponseDTO());
        AgenciamentoPageResponseDTO response = service.filtros(TipoImovel.CASA, null, null, null, null, null, null, null, false, PageRequest.of(0, 12));
        assertNotNull(response); // Verifica se o valor passado não é nulo
        verify(repository).findAll(any(Specification.class), any(Pageable.class));
        verify(mapper).converterPageParaDTO(any());
    }
    @Test
    @DisplayName("Deve retornar sucesso tendo o valor do bairro")
    void deveRetornarFiltrado_quandoBairroInformado(){
        List<AgenciamentoModel> listaAgs = List.of(new AgenciamentoModel(), new AgenciamentoModel());
        Page<AgenciamentoModel> page = new PageImpl<>(listaAgs);
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);
        when(mapper.converterPageParaDTO(page)).thenReturn(new AgenciamentoPageResponseDTO());
        AgenciamentoPageResponseDTO response = service.filtros(null, null, null, "Lourdes", null, null, null, null, false, PageRequest.of(0, 12));
        assertNotNull(response);
        verify(repository).findAll(any(Specification.class), any(Pageable.class)); // Faz o teste dos metodos que mockamos
        verify(mapper).converterPageParaDTO(any());
    }
    @Test
    @DisplayName("Deve retornar sucesso tendo a faixa de preço")
    void deveRetornarFiltrado_quandoFaixaDePrecoForInformada(){
        Page<AgenciamentoModel> page = new PageImpl<>(List.of(new AgenciamentoModel(), new AgenciamentoModel()));
        when(mapper.converterPageParaDTO(page)).thenReturn(new AgenciamentoPageResponseDTO());
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);
        AgenciamentoPageResponseDTO response = service.filtros(null, null,null, null, new BigDecimal(400_000), new BigDecimal(600_000), null, null, false, PageRequest.of(0, 12));
        assertNotNull(response);
        verify(repository).findAll(any(Specification.class), any(Pageable.class));
        verify(mapper).converterPageParaDTO(any());
    }
    @Test
    @DisplayName("Deve retornar um objeto vazio caso não tiver nenhum page passado")
    void deveRetornarVazio_quandoNenhumResultado(){
        when(mapper.converterPageParaDTO(Page.empty())).thenReturn(new AgenciamentoPageResponseDTO());
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(Page.empty());
        AgenciamentoPageResponseDTO response = service.filtros(null, null, null, null, null, null, null, null, false, PageRequest.of(0, 12));
        assertEquals(List.of(), response.getContent());
        verify(repository).findAll(any(Specification.class), any(Pageable.class));
        verify(mapper).converterPageParaDTO(any());
    }
}