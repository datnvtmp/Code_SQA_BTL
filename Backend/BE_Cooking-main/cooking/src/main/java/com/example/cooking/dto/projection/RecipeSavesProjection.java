package com.example.cooking.dto.projection;

public interface RecipeSavesProjection {
    Long getRecipeId();
    Long getSaveCount();
    Boolean getSavedByUser();
}
