package com.example.cooking.dto.request;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StepRequestDTO {

    @NotNull
    private Integer stepNumber;

    private Long stepTime;

    @NotBlank
    private String description;

    private List<MultipartFile> images;

}
