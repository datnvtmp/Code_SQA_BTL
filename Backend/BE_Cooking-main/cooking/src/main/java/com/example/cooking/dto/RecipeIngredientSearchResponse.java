package com.example.cooking.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class RecipeIngredientSearchResponse {

    private Long recipeId;
    private String title;
    private String description;
    private String imageUrl;
    private Integer prepTime;
    private Integer cookTime;
    private String difficulty;
    private Integer servings;
    private String scope;
    private String status;
    private Integer views;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String matchedIngredients;
    private String missingFromInput;
    private String missingFromRecipe;
    private Integer matchedCount;
    private Integer totalRecipeIngredients;
    private String allIngredients;

}
