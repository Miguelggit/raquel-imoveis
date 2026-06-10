package com.api.raquelimoveis.foto.database.repository;

import com.api.raquelimoveis.foto.database.model.FotoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FotoRepository extends JpaRepository<FotoModel, Long> {
    List<FotoModel> findByAgenciamentoModelId(Long agenciamentoId);
    FotoModel findByNomeArmazenado(String nomeArmazenado);
}
