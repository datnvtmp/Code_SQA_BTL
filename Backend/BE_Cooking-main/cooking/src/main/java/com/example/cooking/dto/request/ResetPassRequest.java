package com.example.cooking.dto.request;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// import com.fasterxml.jackson.annotation.JsonProperty;
@Data
public class ResetPassRequest {
    @NotBlank
    private String email;

    @NotBlank
    @Size(min=6)
    private String password;

    @NotBlank
    @Size(min= 6)
    private String confirmPassword;
}
