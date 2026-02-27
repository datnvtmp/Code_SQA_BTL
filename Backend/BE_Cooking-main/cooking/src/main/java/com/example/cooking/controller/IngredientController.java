package com.example.cooking.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cooking.common.ApiResponse;
import com.example.cooking.common.PageDTO;
import com.example.cooking.dto.IngredientDTO;
import com.example.cooking.dto.projection.IngredientTopUsageProjection;
import com.example.cooking.dto.response.RecipeSummaryDTO;
import com.example.cooking.security.MyUserDetails;
import com.example.cooking.service.IngredientService;
import com.example.cooking.service.RecipeService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ingredient")
@RequiredArgsConstructor
public class IngredientController {
    private final IngredientService ingredientService;
    private final RecipeService recipeService;

    @GetMapping("/search-by-keyword")
    public ResponseEntity<ApiResponse<PageDTO<IngredientDTO>>> searchByKeyword(@RequestParam String keyword,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ){
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.ok(ingredientService.searchByKeyWord(keyword, pageable));
    }

    @Operation(summary = "Lấy top nguyên liệu xuất hiện nhiều trong các món nhất")
    @GetMapping("/top")
    public ResponseEntity<ApiResponse<PageDTO<IngredientTopUsageProjection>>> getTopIngredients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageDTO<IngredientTopUsageProjection> result = ingredientService.getTop10Ingredients(page, size);
        return ApiResponse.ok(result);
    }

    @Operation(
    summary = "Lấy danh sách công thức theo id nguyên liệu",
    description = "API trả về danh sách công thức (Recipe) thuộc một nguyên liệu (ingredient) theo phân trang."
    )
    @GetMapping("/{id}/recipes")
    public ResponseEntity<ApiResponse<PageDTO<RecipeSummaryDTO>>> getRecipeByIngredientId(@AuthenticationPrincipal MyUserDetails currentUser,
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.ok(recipeService.getRecipesByIngredientId(currentUser, id, pageable));
    }
}
