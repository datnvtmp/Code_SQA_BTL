package com.example.cooking.service;

import org.springframework.stereotype.Service;

import com.example.cooking.dto.request.RecipeIngredientRequestDTO;
import com.example.cooking.model.Ingredient;
import com.example.cooking.model.Recipe;
import com.example.cooking.model.RecipeIngredient;
import com.example.cooking.repository.RecipeIngredientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecipeIngredientService {

    private final IngredientService ingredientService;
    // private final RecipeIngredientRepository recipeIngredientRepository;

    public RecipeIngredient createFromDTO(RecipeIngredientRequestDTO dto, Recipe recipe) {
        
        Ingredient ingredient = ingredientService.findOrCreateIngredient(dto.getRawName());

        RecipeIngredient ri = new RecipeIngredient();
        ri.setRecipe(recipe);
        ri.setIngredient(ingredient);
        ri.setQuantity(dto.getQuantity());
        ri.setUnit(dto.getUnit());
        ri.setRawName(dto.getRawName()); // giữ lại rawName người dùng nhập
        ri.setNote(dto.getNote());
        ri.setDisplayOrder(dto.getDisplayOrder());

        // Thêm vào collection của recipe, để cascade quản lý
        recipe.getRecipeIngredients().add(ri);

        return ri;
    }
}
