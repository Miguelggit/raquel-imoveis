package com.api.raquelimoveis.agenciamento.database.repository;

import com.api.raquelimoveis.agenciamento.database.model.AgenciamentoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgenciamentoRepository extends JpaRepository<AgenciamentoModel, Long>{
}
