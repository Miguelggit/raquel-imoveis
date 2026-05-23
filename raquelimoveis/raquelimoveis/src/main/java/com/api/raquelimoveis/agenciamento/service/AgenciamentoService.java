package com.api.raquelimoveis.agenciamento.service;
import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoRequestDTO;
import com.api.raquelimoveis.agenciamento.controller.dto.AgenciamentoResponseDTO;
import com.api.raquelimoveis.agenciamento.database.model.AgenciamentoModel;
import com.api.raquelimoveis.agenciamento.database.repository.AgenciamentoRepository;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
@Service
public class AgenciamentoService {
    private AgenciamentoRepository repository;

    private List<AgenciamentoModel> cadastroAGS = new ArrayList<>();
    private List<Long> codAgsCahce = new ArrayList<>();

    public AgenciamentoService(AgenciamentoRepository repository) {
        this.repository = repository;
    }

    public AgenciamentoResponseDTO cadastrarAgenciamento(AgenciamentoRequestDTO dto){
        String cod = geradorDeCodigoAGS(dto);
        dto.setCodigoAgs(cod);
        AgenciamentoModel ags = new AgenciamentoModel(
                dto.getCodigoAgs(),
                dto.getTitulo(),
                dto.getDescricao(),
                dto.getTipoImovel(),
                dto.getStatus(),
                dto.getValorVenda(),
                dto.getCidade(),
                dto.getBairro(),
                dto.getRua(),
                dto.getNumero(),
                dto.getComplemento(),
                dto.getAreaM2(),
                dto.getQuartos(),
                dto.getBanheiros(),
                dto.getVagasGaragem(),
                dto.getCriadoEM(),
                dto.getAtualizadoEM()
        );
        cadastroAGS.add(ags);
        AgenciamentoModel salvado = repository.save(ags);

        return converterParaDTO(ags);
    }

    public String geradorDeCodigoAGS(AgenciamentoRequestDTO dto){
        if(cadastroAGS.isEmpty()){
            codAgsCahce.add(1L);
            return "AGS-001";
        }
        long getValue = codAgsCahce.stream()
                .mapToLong(Long::longValue)
                .max()
                .getAsLong();

        if(getValue > 1 && getValue < 10) {
            getValue = getValue + 1;
            codAgsCahce.add(getValue);
            String cod = String.valueOf(getValue);
            return "AGS-00"+cod;
        } else if (getValue >= 10 && getValue < 100){
            getValue = getValue + 1;
            codAgsCahce.add(getValue);
            String cod = String.valueOf(getValue);
            return "AGS-0"+cod;
        } else {
            getValue = getValue + 1;
            codAgsCahce.add(getValue);
            String cod = String.valueOf(getValue);
            return "AGS-0"+cod;
        }
    }
    public AgenciamentoResponseDTO converterParaDTO(AgenciamentoModel model){
        return new AgenciamentoResponseDTO(
                model.getId(),
                model.getCodigoAgs(),
                model.getTitulo(),
                model.getDescricao(),
                model.getTipoImovel(),
                model.getStatus(),
                model.getValorVenda(),
                model.getCidade(),
                model.getBairro(),
                model.getRua(),
                model.getNumero(),
                model.getComplemento(),
                model.getAreaM2(),
                model.getQuartos(),
                model.getBanheiros(),
                model.getVagasGaragem(),
                model.getCriadoEM(),
                model.getAtualizadoEM()
        );
    }
}
