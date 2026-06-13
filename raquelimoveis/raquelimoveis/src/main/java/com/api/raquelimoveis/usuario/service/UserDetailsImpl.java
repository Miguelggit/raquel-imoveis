package com.api.raquelimoveis.usuario.service;

import com.api.raquelimoveis.usuario.database.model.UsuarioModel;
import com.api.raquelimoveis.usuario.enums.Role;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;

@Component
@RequiredArgsConstructor
public class UserDetailsImpl implements UserDetails {

    private UsuarioModel user;

    public UserDetailsImpl(UsuarioModel user) {
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public @Nullable String getPassword() {
        return user.getSenha();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if(user.getRole().equals(Role.ADMIN)){
            return List.of(new SimpleGrantedAuthority("ROLES_ADMIN"), new SimpleGrantedAuthority("ROLES_USER"));
        }
        return List.of(new SimpleGrantedAuthority("ROLES_USER"));
    }



    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

}
