package com.api.raquelimoveis.usuario.service;

import com.api.raquelimoveis.usuario.database.model.UsuarioModel;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;

@Service
public class JwtTokenService {

    @Value("${app.jwt.secretKey}")
    private String secretKey;
    private final String ISSUER = "raquel-imoveis-api";

    public String generateToken(UsuarioModel user){
        try {
            Algorithm alg = Algorithm.HMAC256(secretKey);
            return JWT.create()
                    .withIssuer(ISSUER)
                    .withIssuedAt(Date.from(Instant.now()))
                    .withExpiresAt(Date.from(Instant.now().plusSeconds(86400L)))
                    .withSubject(user.getEmail())
                    .sign(alg);
        } catch (JWTVerificationException e) {
            throw new JWTVerificationException("Não foi possivel validar o token");
        }
    }

    public String validationToken(String token){
        Algorithm alg = Algorithm.HMAC256(secretKey);
        return JWT.require(alg)
                .withIssuer(ISSUER)
                .build()
                .verify(token)
                .getSubject();
    }
}
