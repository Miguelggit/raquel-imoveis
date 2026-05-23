package com.api.raquelimoveis.agenciamento.globalexceptionhandler;
import com.api.raquelimoveis.agenciamento.controller.dto.ErroResponseDTO;
import com.api.raquelimoveis.agenciamento.exceptions.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class) // Passar a Exception a ser usada
    public ResponseEntity<ErroResponseDTO> handleTipoImovelInvalido(ResourceNotFoundException ex) { // Dentro dos "()" passamos a exception que iremos tratar igual ao que usamos na anotação
        ErroResponseDTO err = new ErroResponseDTO(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
    }
}
