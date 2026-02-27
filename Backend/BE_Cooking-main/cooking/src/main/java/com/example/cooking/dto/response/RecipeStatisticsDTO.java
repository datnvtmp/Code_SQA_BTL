package com.example.cooking.dto.response;

import java.util.List;
import java.util.Map;

import com.example.cooking.dto.RecipeDifficultyCountDTO;
import com.example.cooking.dto.RecipeScopeCountDTO;
import com.example.cooking.dto.RecipeStatusCountDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeStatisticsDTO {
    private Long totalRecipes;
    private Long totalViews;
    private Long totalLikes;
    private List<RecipeStatusCountDTO> byStatus;
    private List<RecipeDifficultyCountDTO> byDifficulty;
    private List<RecipeScopeCountDTO> byScope;
}
