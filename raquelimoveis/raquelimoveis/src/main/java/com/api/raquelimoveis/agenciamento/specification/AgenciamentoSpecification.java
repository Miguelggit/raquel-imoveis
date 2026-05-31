package com.api.raquelimoveis.agenciamento.specification;

import com.api.raquelimoveis.agenciamento.database.model.AgenciamentoModel;
import com.api.raquelimoveis.agenciamento.enums.StatusAgenciamentos;
import com.api.raquelimoveis.agenciamento.enums.TipoImovel;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class AgenciamentoSpecification {
    public static Specification<AgenciamentoModel> porTipoImovel(TipoImovel tipoImovel){
        return (rt, cq, cb) -> cb.equal(rt.get("tipoImovel"), tipoImovel);
    }
    public static Specification<AgenciamentoModel> porStatus(StatusAgenciamentos status){
        return (rt, cq, cb) -> cb.equal(rt.get("status"), status);
    }
    public static Specification<AgenciamentoModel> porCidade(String cidade){
        return (rt, cq, cb) -> cb.equal(
                cb.lower(rt.get("cidade")),
                cidade.toLowerCase()
        );
    }
    public static Specification<AgenciamentoModel> porBairro (String bairro){
        return (rt, cq, cb) -> cb.equal(
                cb.lower(rt.get("bairro")),
                bairro.toLowerCase()
        );
    }
    public static Specification<AgenciamentoModel> porPrecoMinimo(BigDecimal precoImovel){
        return (rt, cq, cb) -> cb.greaterThanOrEqualTo(rt.get("valorVenda"), precoImovel);
    }
    public static Specification<AgenciamentoModel> porPrecoMaximo(BigDecimal precoImovel){
        return (rt, cq, cb) -> cb.lessThanOrEqualTo(rt.get("valorVenda"), precoImovel);
    }
    public static Specification<AgenciamentoModel> statusDiferenteDe(StatusAgenciamentos status){
        return (rt, cq, cb) -> cb.notEqual(rt.get("status"), status);
    }
}
