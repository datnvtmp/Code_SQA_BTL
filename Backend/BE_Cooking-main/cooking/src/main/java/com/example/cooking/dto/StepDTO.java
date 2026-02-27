package com.example.cooking.dto;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StepDTO {

    @NotNull
    private Integer stepNumber;

    @NotBlank
    private String description;

    private Long stepTime;

    private List<String> imageUrls;

}
