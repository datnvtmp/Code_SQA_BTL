package com.example.cooking.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddTagRequest {

    @NotBlank
    private String name;
}
