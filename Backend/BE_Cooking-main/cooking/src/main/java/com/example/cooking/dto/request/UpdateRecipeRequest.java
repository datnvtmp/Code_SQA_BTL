package com.example.cooking.dto.request;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.cooking.common.enums.Difficulty;
import com.example.cooking.common.enums.Scope;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateRecipeRequest {
    @NotBlank
    private String title;

    private String description;

    @NotNull
    private Long servings;

    @NotNull
    private Long prepTime;

    @NotNull
    private Long cookTime;

    @NotNull
    private Difficulty difficulty;

    @NotNull
    private Scope scope;

    private MultipartFile image;
    private String videoUrl;

    @NotNull
    private List<StepRequestDTO> steps;

    @NotNull
    private List<RecipeIngredientRequestDTO> recipeIngredients;

    private List<Long> categoryIds;
    private List<Long> tagIds;
}
