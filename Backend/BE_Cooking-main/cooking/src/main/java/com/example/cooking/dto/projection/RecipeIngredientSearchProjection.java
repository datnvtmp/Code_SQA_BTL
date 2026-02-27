package com.example.cooking.dto.projection;


import java.time.LocalDateTime;

public interface RecipeIngredientSearchProjection {

    Long getRecipeId();
    String getTitle();
    String getDescription();
    String getImageUrl();
    Integer getPrepTime();
    Integer getCookTime();
    String getDifficulty();
    Integer getServings();
    String getScope();
    String getStatus();
    Integer getViews();
    LocalDateTime getCreatedAt();
    LocalDateTime getUpdatedAt();

    String getMatchedIngredients();
    String getMissingFromInput();
    String getMissingFromRecipe();
    Integer getMatchedCount();
    Integer getTotalRecipeIngredients();

    String getAllIngredients();
}
