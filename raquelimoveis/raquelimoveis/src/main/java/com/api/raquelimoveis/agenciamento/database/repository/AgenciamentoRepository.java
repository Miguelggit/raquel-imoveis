package com.api.raquelimoveis.agenciamento.database.repository;

import com.api.raquelimoveis.agenciamento.database.model.AgenciamentoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AgenciamentoRepository extends JpaRepository<AgenciamentoModel, Long>, JpaSpecificationExecutor<AgenciamentoModel>{
    @Query("SELECT MAX(tb_agenciamentos.codigoAgs) FROM AgenciamentoModel tb_agenciamentos")
    String findMaxCodigoAgs();
}
