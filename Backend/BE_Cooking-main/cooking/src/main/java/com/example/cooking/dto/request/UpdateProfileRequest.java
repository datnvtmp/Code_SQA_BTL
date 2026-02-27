package com.example.cooking.dto.request;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class UpdateProfileRequest {

    private String username;

    // private String email;

    private String bio;

    private LocalDate dob;

    private MultipartFile avatar;
}
