package com.example.cooking.dto.response;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

import com.example.cooking.common.enums.Difficulty;
import com.example.cooking.common.enums.Scope;
import com.example.cooking.common.enums.Status;
import com.example.cooking.dto.CategoryDTO;
import com.example.cooking.dto.RecipeIngredientDTO;
import com.example.cooking.dto.StepDTO;
import com.example.cooking.dto.TagDTO;
import com.example.cooking.dto.UserDTO;

import lombok.Data;

@Data
public class RecipeDetailResponse {

    private Long id;

    private String title;

    private String description;

    private Long servings;

    private Long prepTime;

    private Long cookTime;

    private Difficulty difficulty;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String imageUrl;

    private String videoUrl;

    private Long views = 1L;

    private Scope scope;
    private Status status;
    private UserDTO user;
    private Set<StepDTO> steps = new LinkedHashSet<>();
    private Set<RecipeIngredientDTO> ingredients = new LinkedHashSet<>();
    private Set<CategoryDTO> categories = new LinkedHashSet<>();
    private Set<TagDTO> tags = new LinkedHashSet<>();
    private Long likeCount;
    private Long saveCount;
    //
    private Long commentCount;
    private Boolean likedByCurrentUser;
    private Boolean savedByCurrentUser;
}
