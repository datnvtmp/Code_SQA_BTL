package com.example.cooking.dto;

import com.example.cooking.common.enums.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeDifficultyCountDTO {
    private Difficulty difficulty;
    private Long count;
}
