package com.example.cooking.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.cooking.common.ApiResponse;
import com.example.cooking.common.PageDTO;
import com.example.cooking.dto.TagDTO;
import com.example.cooking.dto.response.RecipeSummaryDTO;
import com.example.cooking.security.MyUserDetails;
import com.example.cooking.service.RecipeService;
import com.example.cooking.service.TagService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;
    private final RecipeService recipeService;

    // TODO: check role USER or ADMIN
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<TagDTO>> createTag(@RequestParam String tagName) {
        return ApiResponse.ok(tagService.createTag(tagName));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TagDTO>> getTagById(@PathVariable Long id) {
        return ApiResponse.ok(tagService.getTagById(id));
    }

    @GetMapping("/{id}/recipes")
    public ResponseEntity<ApiResponse<PageDTO<RecipeSummaryDTO>>> getRecipeByTagId(@AuthenticationPrincipal MyUserDetails currentUser,
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.ok(recipeService.getRecipeByTagId(currentUser,id, pageable));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<TagDTO>> getTagBySlug(@PathVariable String slug) {
        return ApiResponse.ok(tagService.getTagBySlug(slug));
    }

    //TODO: chia page
    @GetMapping
    public ResponseEntity<ApiResponse<List<TagDTO>>> getAllTags() {
        return ApiResponse.ok(tagService.getAllTags());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // chỉ admin được xóa
    public ResponseEntity<ApiResponse<String>> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ApiResponse.ok("Đã thực hiện");
    }

    @GetMapping("/suggest")
    public ResponseEntity<ApiResponse<List<TagDTO>>> autoCompleteTags(@RequestParam String keyword) {
        List<TagDTO> suggestions = tagService.autocomplete(keyword);
        return ApiResponse.ok(suggestions);
    }
}
