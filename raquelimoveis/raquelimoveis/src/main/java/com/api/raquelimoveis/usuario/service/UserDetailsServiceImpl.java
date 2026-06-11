package com.api.raquelimoveis.usuario.service;

import com.api.raquelimoveis.usuario.database.model.UsuarioModel;
import com.api.raquelimoveis.usuario.database.repository.UsuarioRepository;
import exceptions.IdentificadorNaoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsuarioRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return new UserDetailsImpl(findEmail(username));
    }

    public UsuarioModel findEmail(String email){
        return repository.findByEmail(email)
                .orElseThrow(
                        () -> new IdentificadorNaoEncontradoException("O username não foi encontrado")
                );
    }

}
