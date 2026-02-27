package com.example.cooking.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.cooking.common.ApiResponse;

import jakarta.persistence.EntityNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // xu ly cho @Valid
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationException(
            MethodArgumentNotValidException ex) {
        Map<String, String> errs = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errs.put(error.getField(), error.getDefaultMessage());
        });
        return ApiResponse.error(HttpStatus.BAD_REQUEST, errs.toString());
    }

    @ExceptionHandler(DuplicateFieldException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleDuplicateField(DuplicateFieldException ex) {
        return ApiResponse.error(HttpStatus.BAD_REQUEST, ex.getErrors().toString());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleUsernameNotFoundException(
            BadCredentialsException ex) {
        Map<String, String> errs = new HashMap<>();
        errs.put("errs", ex.getMessage());
        // return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errs);
        return ApiResponse.error(HttpStatus.BAD_REQUEST, errs.toString());
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleUserNotFoundException(UserNotFoundException ex) {
        Map<String, String> errs = new HashMap<>();
        errs.put("errs", ex.getMessage());
        return ApiResponse.error(HttpStatus.BAD_REQUEST, errs.toString());

    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleCustomException(CustomException ex) {
        Map<String, String> errs = new HashMap<>();
        errs.put("errs", ex.getMessage());
        return ApiResponse.error(HttpStatus.BAD_REQUEST, errs.toString());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        Map<String, String> errs = new HashMap<>();
        errs.put("errs", ex.getMessage());
        return ApiResponse.error(HttpStatus.BAD_REQUEST, errs.toString());
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleSecurityException(SecurityException ex) {
        Map<String, String> errs = new HashMap<>();
        errs.put("errs", ex.getMessage());
        return ApiResponse.error(HttpStatus.BAD_REQUEST, errs.toString());
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleEntityNotFoundException(EntityNotFoundException ex) {
        Map<String, String> errs = new HashMap<>();
        errs.put("errs", ex.getMessage());
        return ApiResponse.error(HttpStatus.BAD_REQUEST, errs.toString());
    }
}
