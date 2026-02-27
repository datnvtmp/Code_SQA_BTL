package com.example.cooking.common;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import lombok.Builder;
import lombok.Data;
@Data
@Builder
public class ApiResponse<T> {
    private int status;
    private String message;
    private T data;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

        public static <T> ResponseEntity<ApiResponse<T>> ok (T data){
        
        return ResponseEntity.ok(ApiResponse.<T>builder()
                                                .status(HttpStatus.OK.value())
                                                .message("Thanh cong")
                                                .data(data).build());
    }
    public static <T> ResponseEntity<ApiResponse<T>> error (HttpStatus status,String message){
        
        return ResponseEntity.status(status).body(ApiResponse.<T>builder()
                                                            .status(status.value())
                                                            .message(message)
                                                            .data(null)
                                                            .build());
    }
    public static <T> ResponseEntity<ApiResponse<T>> custom (HttpStatus status,String message, T data){
        
        return ResponseEntity.status(status).body(ApiResponse.<T>builder()
                                                            .status(status.value())
                                                            .message(message)
                                                            .data(data).build());
    }
}
