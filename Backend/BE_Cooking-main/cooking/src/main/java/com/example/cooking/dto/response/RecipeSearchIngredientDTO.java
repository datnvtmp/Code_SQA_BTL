package com.example.cooking.dto.response;

import lombok.Data;

@Data
public class RecipeSearchIngredientDTO {
    private RecipeSummaryDTO recipeSummaryDTO;
    
    private String matchedIngredients;
    private String missingFromInput;
    private String missingFromRecipe;
    private Integer matchedCount;
    private Integer totalIngredients;
}
