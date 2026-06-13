package com.api.raquelimoveis.usuario.service;

import com.api.raquelimoveis.usuario.database.model.UsuarioModel;
import com.api.raquelimoveis.usuario.enums.Role;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NullMarked;
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
        this.user = user;
    }

    @NullMarked
    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public @Nullable String getPassword() {
        return user.getSenha();
    }

    @NullMarked
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if(user.getRole().equals(Role.ADMIN)){
            return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
        }
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }


    @NullMarked
    @Override
    public boolean isEnabled() {
        return true;
    }

    @NullMarked
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @NullMarked
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @NullMarked
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

}
