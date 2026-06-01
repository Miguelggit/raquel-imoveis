package com.api.raquelimoveis.agenciamento.specification;

import com.api.raquelimoveis.agenciamento.database.model.AgenciamentoModel;
import com.api.raquelimoveis.agenciamento.enums.StatusAgenciamentos;
import com.api.raquelimoveis.agenciamento.enums.TipoImovel;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class AgenciamentoSpecification {
    public static Specification<AgenciamentoModel> statusDiferentesDe(StatusAgenciamentos status){
        return (root, query, cb) -> cb.notEqual(root.get("status"), status);
    }
    public static Specification<AgenciamentoModel> porStatus(StatusAgenciamentos status){
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }
    public static Specification<AgenciamentoModel> porTipoDeImovel(TipoImovel tipoImovel) {
        return (root, query, cb) -> cb.equal(root.get("tipoImovel"), tipoImovel);
    }
    public static Specification<AgenciamentoModel> porBairro(String bairro){
        return (root, query, cb) -> cb.equal(root.get("bairro".toLowerCase()), bairro.toLowerCase());
    }
    public static Specification<AgenciamentoModel> porCidade(String cidade){
        return (root, query, cb) -> cb.equal(root.get("cidade".toLowerCase()), cidade.toLowerCase());
    }
    public static Specification<AgenciamentoModel> porPrecoMinimo(BigDecimal valorVenda) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("valorVenda"), valorVenda);
    }
    public static Specification<AgenciamentoModel> porPrecoMaximo(BigDecimal valorVenda){
        return (root, qury, cb) -> cb.lessThanOrEqualTo(root.get("valorVenda"), valorVenda);
    }
}
