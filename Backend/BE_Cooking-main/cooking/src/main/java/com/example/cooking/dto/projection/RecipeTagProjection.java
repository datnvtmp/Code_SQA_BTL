package com.example.cooking.dto.projection;

import lombok.Data;

// Tương tự cho tags
@Data
public class RecipeTagProjection {
    private Long recipeId;
    private Long tagId;
    private String tagName;
    private String tagSlug;
    
    public RecipeTagProjection(Long recipeId, Long tagId, String tagName, String tagSlug) {
        this.recipeId = recipeId;
        this.tagId = tagId;
        this.tagName = tagName;
        this.tagSlug = tagSlug;
    }
}
