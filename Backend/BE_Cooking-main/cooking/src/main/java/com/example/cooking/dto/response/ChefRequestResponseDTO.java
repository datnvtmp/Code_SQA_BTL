package com.example.cooking.dto.response;

import java.time.LocalDateTime;

import com.example.cooking.common.enums.RequestStatus;
import com.example.cooking.dto.UserDTO;

import lombok.Data;

@Data
public class ChefRequestResponseDTO {
        private Long id;
        private UserDTO user;
        private RequestStatus status;
        private LocalDateTime createdAt;
        private String adminNote;
}
