package com.example.cooking.controller.pub;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cooking.common.ApiResponse;
import com.example.cooking.common.enums.Scope;
import com.example.cooking.common.enums.Status;
import com.example.cooking.dto.response.RecipeDetailResponse;
import com.example.cooking.service.RecipeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/public")
public class PublicController {
    // private final RecipeService recipeService;
    // private final IngredientService ingredientService;
    // @GetMapping("recipes/{id}")
    // public ResponseEntity<ApiResponse<RecipeDetailResponse>> getRecipeById(@PathVariable Long id) {
    //     RecipeDetailResponse recipe = recipeService.getRecipeByIdAndScopeAndStatus(id, Scope.PUBLIC, Status.APPROVED);
    //     return ApiResponse.ok(recipe);
    // }


}
