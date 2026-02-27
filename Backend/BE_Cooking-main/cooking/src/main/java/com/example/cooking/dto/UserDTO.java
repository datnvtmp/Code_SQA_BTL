package com.example.cooking.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

// import com.example.cooking.model.RoleEntity;

import lombok.Data;
@Data

public class UserDTO {
    private Long id;
    private String username;
    // private String email;
    private LocalDate dob;
    private String bio;
    private String avatarUrl;
    private Set<RoleDTO> roles = new HashSet<>();
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
}
