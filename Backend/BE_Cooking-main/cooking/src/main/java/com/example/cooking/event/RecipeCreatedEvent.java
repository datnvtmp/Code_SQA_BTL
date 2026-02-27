package com.example.cooking.event;

import com.example.cooking.dto.request.NewRecipeRequest;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RecipeCreatedEvent {
    private final Long recipeId;
    private final NewRecipeRequest newRecipeRequest;
    private final String imageUrl;
}