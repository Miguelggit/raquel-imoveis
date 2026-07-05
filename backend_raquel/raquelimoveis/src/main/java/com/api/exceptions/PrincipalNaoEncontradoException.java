package com.api.exceptions;

public class PrincipalNaoEncontradoException extends RuntimeException {
    public PrincipalNaoEncontradoException(String message) {
        super(message);
    }
}
