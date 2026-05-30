package com.api.raquelimoveis.agenciamento.exceptions;
import com.api.raquelimoveis.agenciamento.controller.dto.ErrorResponseDTO;
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
    public ResponseEntity<ErrorResponseDTO> handleCamposObrigatoriosException(MethodArgumentNotValidException exc, HttpServletRequest request) {
        List<FieldErrorDTO> fieldErrors = exc.getBindingResult().getAllErrors().stream()
                .map(error -> new FieldErrorDTO(
                        ((FieldError) error).getField(),
                        error.getDefaultMessage()
                ))
                .toList();
        ErrorResponseDTO erroResponseDTO = new ErrorResponseDTO(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Campos obrigatorios não foram preenchidos",
                request.getRequestURI(),
                fieldErrors
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erroResponseDTO);
    }

    @ExceptionHandler(CadastroDeStatusException.class)
    public ResponseEntity<ErrorResponseDTO> handleCadastroDeStatusException(CadastroDeStatusException ex, HttpServletRequest request) {
        ErrorResponseDTO erroResponseDTO = new ErrorResponseDTO(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                ex.getMessage(),
                request.getRequestURI(),
                null
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erroResponseDTO);
    }

    @ExceptionHandler(IdentificadorNaoEncontradoException.class)
    public ResponseEntity<ErrorResponseDTO> handleCadastroNaoEncontradoException(IdentificadorNaoEncontradoException ex, HttpServletRequest rq) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                rq.getRequestURI(),
                null
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponseDTO);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleCadastroNaoEncontradoException(Exception ex, HttpServletRequest rq) {
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                rq.getRequestURI(),
                null
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponseDTO);
    }

    @ExceptionHandler(InativarAgenciamentoException.class)
    public ResponseEntity<ErrorResponseDTO> handleInactiveException(InativarAgenciamentoException ex, HttpServletRequest rq){
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                rq.getRequestURI(),
                null
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponseDTO);
    }
}
