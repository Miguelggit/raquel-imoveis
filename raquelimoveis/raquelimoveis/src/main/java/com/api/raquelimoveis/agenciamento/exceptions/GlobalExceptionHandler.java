package com.api.raquelimoveis.agenciamento.exceptions;
import com.api.raquelimoveis.agenciamento.controller.dto.ErroResponseDTO;
import com.api.raquelimoveis.agenciamento.controller.dto.FieldErrorDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponseDTO> handleCamposObrigatoriosException(MethodArgumentNotValidException exc, HttpServletRequest request){
        List<FieldErrorDTO> fieldErrors = exc.getBindingResult().getAllErrors().stream()
                .map(error -> new FieldErrorDTO(
                        ((FieldError) error).getField(),
                        error.getDefaultMessage()
                ))
                .toList();
        ErroResponseDTO erroResponseDTO = new ErroResponseDTO(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Campos obrigatorios não foram preenchidos",
                request.getRequestURI(),
                fieldErrors
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erroResponseDTO);
    }

    @ExceptionHandler(CadastroDeStatusException.class)
    public ResponseEntity<ErroResponseDTO> handleCadastroDeStatusException(CadastroDeStatusException ex, HttpServletRequest request){
        ErroResponseDTO erroResponseDTO = new ErroResponseDTO(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                ex.getMessage(),
                request.getRequestURI(),
                null
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erroResponseDTO);
    }
}
