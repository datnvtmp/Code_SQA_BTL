package com.example.cooking.event;

import com.example.cooking.dto.request.UpdateRecipeRequest;

import lombok.AllArgsConstructor;
import lombok.Getter;
@Getter
@AllArgsConstructor
public class RecipeUpdatedEvent {
    private final Long recipeId;
    private final UpdateRecipeRequest updateRecipeRequest;
    private final String imageUrl;
}
