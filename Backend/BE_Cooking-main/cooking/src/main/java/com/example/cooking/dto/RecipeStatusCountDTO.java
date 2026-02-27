package com.example.cooking.dto;

import com.example.cooking.common.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeStatusCountDTO {
    private Status status;
    private Long count;
}

