package com.api.raquelimoveis.agenciamento.mapper;

import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoPageResponseDTO;
import com.api.raquelimoveis.agenciamento.database.model.AgenciamentoModel;
import com.api.raquelimoveis.agenciamento.enums.TipoImovel;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class AgenciamentoMapperTest {

    @InjectMocks
    private AgenciamentoMapper mapper;

    @Test
    @DisplayName("Deve converter o Page para o Dto caso tenha os dados necessarios")
    void deveConverterPageParaDTO_quandoPageTiverConteudo() {
        AgenciamentoModel model = new AgenciamentoModel();
        model.setId(1L);
        model.setTitulo("Casa em Lourdes");
        model.setBairro("Nossa Senhora de Lourdes");
        model.setVagasGaragem(1);
        model.setCidade("Caxias do Sul");
        model.setTipoImovel(TipoImovel.CASA);
        model.setAreaM2(new BigDecimal(114));
        model.setValorVenda(new BigDecimal(350_000));
        model.setQuartos(3);
        model.setNumero("1213");
        model.setDescricao("Sobrado em Lourdes");
        model.setComplemento("Na frente de Escola Adventista");
        model.setCriadoEM(LocalDateTime.now());
        Page<AgenciamentoModel> page = new PageImpl<>(List.of(model), PageRequest.of(0, 12), 1);
        AgenciamentoPageResponseDTO response = mapper.converterPageParaDTO(page);
        assertEquals(1, response.getContent().size());
        assertEquals(0, response.getPage());
        assertEquals(12, response.getSize());
        assertEquals(1L, response.getTotalElements());
    }
    @Test
    @DisplayName("Deve converter o Page para um DTO mesmo com o Page sendo vazio")
    void deveConverterPageParaDTO_quandoPageForVazio(){
        AgenciamentoPageResponseDTO response = mapper.converterPageParaDTO(Page.empty());
        assertEquals(0, response.getContent().size());
        assertEquals(0, response.getPage());
        assertEquals(0, response.getSize());
        assertEquals(0, response.getTotalElements());
    }
}