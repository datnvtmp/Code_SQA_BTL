package com.example.cooking.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.example.cooking.common.ApiResponse;
import com.example.cooking.security.MyUserDetails;
import com.example.cooking.service.RecipeLikeService;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/recipes/{id}/like")
@RequiredArgsConstructor
public class RecipeLikeController {
    private final RecipeLikeService likeService;

    @PostMapping
    public ResponseEntity<ApiResponse<String>> likeRecipe(
            @PathVariable @Parameter(description = "ID of the recipe to like") Long id,
            @AuthenticationPrincipal MyUserDetails currentUser) {
        likeService.likeRecipe(currentUser, id);
        return ApiResponse.ok("Liked recipe with ID: " + id);
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<String>> unlikeRecipe(
            @PathVariable @Parameter(description = "ID of the recipe to unlike") Long id,
            @AuthenticationPrincipal MyUserDetails currentUser) {
        likeService.unlikeRecipe(currentUser, id);
        return ApiResponse.ok("Unliked recipe with ID: " + id);
    }
}
