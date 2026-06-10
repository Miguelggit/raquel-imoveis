package com.api.raquelimoveis.usuario.service;

import com.api.raquelimoveis.usuario.database.model.UsuarioModel;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;

@Service
public class JwtTokenService {

    @Value("${app.jwt.secret}")
    private String SECRET_KEY;
    private final String ISSUER = "raquel-imoveis-api";

    public String generateToken(UsuarioModel user){
        try {
            Algorithm alg = Algorithm.HMAC256(SECRET_KEY);

            return JWT.create()
                    .withIssuer(ISSUER)
                    .withIssuedAt(Date.from(Instant.now()))
                    .withExpiresAt(Date.from(Instant.now().plusSeconds(86400L)))
                    .withSubject(user.getEmail())
                    .sign(alg);
        } catch (JWTVerificationException e) {
            throw new JWTVerificationException(e.getMessage());
        }
    }

    public String validationToken(String token){
        Algorithm alg = Algorithm.HMAC256(SECRET_KEY);
        return JWT.require(alg)
                .withIssuer(ISSUER)
                .build()
                .verify(token)
                .getSubject();
    }
}
