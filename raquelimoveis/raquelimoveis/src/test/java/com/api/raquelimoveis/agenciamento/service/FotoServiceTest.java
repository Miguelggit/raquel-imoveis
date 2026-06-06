package com.api.raquelimoveis.agenciamento.service;

import com.api.raquelimoveis.agenciamento.controller.dto.FotoAgenciamentoResponseDTO;
import com.api.raquelimoveis.agenciamento.database.model.AgenciamentoModel;
import com.api.raquelimoveis.agenciamento.database.model.FotoModel;
import com.api.raquelimoveis.agenciamento.database.repository.FotoRepository;
import com.api.raquelimoveis.agenciamento.exceptions.ArquivoVazioException;
import com.api.raquelimoveis.agenciamento.exceptions.FormatoInvalidoException;
import com.api.raquelimoveis.agenciamento.exceptions.IdentificadorNaoEncontradoException;
import com.api.raquelimoveis.agenciamento.mapper.FotoMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class FotoServiceTest {
    @Mock
    private FotoRepository repository;
    @Mock
    private AgenciamentoService serviceAgenciamento;
    @Mock
    private FotoMapper mapper;
    @InjectMocks
    private FotoService service;

    @Test
    @DisplayName("Lançar uma exceção quando caso o Agenciamento não exista")
    void deveLancarExcecao_quandoAgenciamentoNaoExistir() {
        when(serviceAgenciamento.buscarAgenciamentoPorId(99L))
                .thenThrow(new IdentificadorNaoEncontradoException("O ID: 99 não foi encontrado"));

        IdentificadorNaoEncontradoException exc = assertThrows(IdentificadorNaoEncontradoException.class, () -> {
            service.uploadPhoto(99L, mock(MultipartFile.class));
        });
        assertEquals("O ID: 99 não foi encontrado", exc.getMessage());
    }
    @Test
    @DisplayName("Lança uma exceção quando o formato do arquivo for invalido")
    void deveLancarExcecao_quandoFormatoInvalido() throws IOException {
        MultipartFile fileMock = new MockMultipartFile(
                "NomeMockado",
                "1312312",
                "image/svg",
                InputStream.nullInputStream()
        );
        when(serviceAgenciamento.buscarAgenciamentoPorId(20L)).thenReturn(new AgenciamentoModel());
        FormatoInvalidoException exception = assertThrows(FormatoInvalidoException.class, () -> {
            service.uploadPhoto(20L, fileMock);
        });
        assertEquals("Formato invalido! Formatos suportados: .png; .jpeg; .webp", exception.getMessage());
    }
    @Test
    @DisplayName("Deve retornar uma lista caso o Agenciamento Exista")
    void deveRetornarListaDeFotos_quandoAgenciamentoExistir(){


        List<FotoModel> listFotoModel = List.of(new FotoModel(), new FotoModel());
        when(repository.findByAgenciamentoModelId(1L)).thenReturn(listFotoModel);
        when(mapper.converterListModelParaListDTO(listFotoModel)).thenReturn(List.of(new FotoAgenciamentoResponseDTO(), new FotoAgenciamentoResponseDTO()));
        List<FotoAgenciamentoResponseDTO> responseDTOList = service.findAllPhotosByAgenciamento(1L);
        assertEquals(2, responseDTOList.size());
        verify(mapper).converterListModelParaListDTO(listFotoModel);
    }
    @Test
    @DisplayName("Deve retornar uma lista vazia se não houver fotos")
    void deveRetornarListaVazia_quandoNaoTiverFotos(){
        List<FotoModel> listFotoModel = List.of();
        when(repository.findByAgenciamentoModelId(1L)).thenReturn(listFotoModel);
        when(mapper.converterListModelParaListDTO(listFotoModel)).thenReturn(List.of());
        List<FotoAgenciamentoResponseDTO> responseDTOList = service.findAllPhotosByAgenciamento(1L);
        assertTrue(responseDTOList.isEmpty());
        verify(mapper).converterListModelParaListDTO(listFotoModel);
    }
    @Test
    @DisplayName("Lança exceção quando o nome armazenado não existir")
    void deveLancarExcecao_quandoNomeArmazenadoNaoExistir(){
        when(repository.findByNomeArmazenado(any()))
                .thenThrow(
                        new ArquivoVazioException("O arquivo que você estava buscando não existe :(")
                );
        ArquivoVazioException exception = assertThrows(ArquivoVazioException.class, () -> {
            service.showPhoto("NameMocakdo");
        });
        assertEquals("O arquivo que você estava buscando não existe :(", exception.getMessage());
    }
    @Test
    @DisplayName("Deve deletar a foto caso exista o ID")
    void deveDeletarFoto_quandoIdExistir() throws IOException {
        FotoModel foto = new FotoModel();
        foto.setNomeArmazenado("nomeMockado");
        when(repository.findById(1L)).thenReturn(Optional.of(foto));

        service.deletePhoto(1L);

        verify(repository).delete(foto);
    }
    @Test
    @DisplayName("Lança exceção caso o ID não exista")
    void deveLancarExcecao_quandoIdNaoExistirNoDelete(){
        when(repository.findById(1L)).thenThrow(new IdentificadorNaoEncontradoException("A foto que você está procurando não está aqui :/"));
        IdentificadorNaoEncontradoException exc = assertThrows(IdentificadorNaoEncontradoException.class, () -> {
            service.deletePhoto(1L);
        });
        assertEquals("A foto que você está procurando não está aqui :/", exc.getMessage());
    }
}