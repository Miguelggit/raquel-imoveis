package com.api.raquelimoveis.usuario.database.repository;

import com.api.raquelimoveis.usuario.database.model.UsuarioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioModel, UUID> {
    UserDetails findByUsername(String username);
}
