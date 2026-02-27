package com.example.cooking.dto.request;


import com.example.cooking.common.enums.Status;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class IngredientRequest {

    @NotBlank
    private String name;

    @NotNull
    private Status status;
}
