package com.api.raquelimoveis.agenciamento.database.repository;

import com.api.raquelimoveis.agenciamento.database.model.FotoAgenciamentoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FotoAgenciamentoRepository extends JpaRepository<FotoAgenciamentoModel, Long> {
    List<FotoAgenciamentoModel> findByAgenciamentoModelId(Long agenciamentoId);
}
