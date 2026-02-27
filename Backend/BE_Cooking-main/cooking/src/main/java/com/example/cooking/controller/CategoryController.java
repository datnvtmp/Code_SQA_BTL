package com.example.cooking.controller;

import com.example.cooking.common.ApiResponse;
import com.example.cooking.common.PageDTO;
import com.example.cooking.dto.CategoryDTO;
import com.example.cooking.dto.request.CategoryRequestDTO;
import com.example.cooking.dto.response.RecipeSummaryDTO;
import com.example.cooking.security.MyUserDetails;
import com.example.cooking.service.CategoryService;
import com.example.cooking.service.RecipeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

import org.hibernate.query.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity; 
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final RecipeService recipeService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageDTO<CategoryDTO>>> getAllCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
                Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.ok(categoryService.getAllCategories(pageable));
    }

    @Operation(
        summary = "Lấy danh sách gợi ý danh mục trên trang ý tưởng",
        description = "API trả về danh sách gợi ý danh mục (Category) để hiển thị trên trang ý tưởng."
    )
    @GetMapping("/ideas")
    public ResponseEntity<ApiResponse<PageDTO<CategoryDTO>>> getIdeaCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
                Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.ok(categoryService.getAllCategories(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> getCategoryById(@PathVariable Long id) {
        return ApiResponse.ok(categoryService.getCategoryById(id));
    }

    @Operation(
        summary = "Gợi ý danh mục",
        description = "API trả về danh sách gợi ý danh mục (Category) dựa trên từ khóa nhập vào."
    )
    @GetMapping("/suggest")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> autoCompleteCategories(@RequestParam String keyword) {
        List<CategoryDTO> suggestions = categoryService.autocomplete(keyword);
        return ApiResponse.ok(suggestions);
    }

    @PostMapping(consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryDTO>> createCategory(@ModelAttribute CategoryRequestDTO category) {
        CategoryDTO created = categoryService.createCategory(category);
        return ApiResponse.ok(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryDTO>> updateCategory(@PathVariable Long id,
            @RequestBody CategoryRequestDTO category) {
        CategoryDTO updated = categoryService.updateCategory(id, category);
        return ApiResponse.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ApiResponse.ok("Đã thực hiện");
    }

    @Operation(
    summary = "Lấy danh sách công thức theo category",
    description = "API trả về danh sách công thức (Recipe) thuộc một danh mục (Category) theo phân trang."
    )
    @GetMapping("/{id}/recipes")
    public ResponseEntity<ApiResponse<PageDTO<RecipeSummaryDTO>>> getRecipeByCategoryId(@AuthenticationPrincipal MyUserDetails currentUser,
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.ok(recipeService.getRecipeByCategoryId(currentUser,id, pageable));
    }
    @Operation(
    summary = "Lấy danh sách công thức theo list category",
    description = "API trả về danh sách công thức (Recipe) thuộc một danh mục (Category) theo phân trang."
    )
    @GetMapping("/recipes/by-categories")
    public ResponseEntity<ApiResponse<PageDTO<RecipeSummaryDTO>>> getRecipesByCategories(
        @AuthenticationPrincipal MyUserDetails currentUser,
        @RequestParam List<Long> categoryIds,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "views") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDir) {

    Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
    Pageable pageable = PageRequest.of(page, size, sort);
    return ApiResponse.ok(recipeService.getRecipesByCategoryIds(currentUser, categoryIds, pageable));
    }

    // @PostMapping("/add-batch")
    // @PreAuthorize("hasRole('ADMIN')")
    // public ResponseEntity<ApiResponse<List<CategoryDTO>>> createCategories(
    //         @RequestBody List<CategoryRequestDTO> categories) {
    //     List<CategoryDTO> createdCategories = categoryService.createCategories(categories);
    //     return ApiResponse.ok(createdCategories);
    // }



    
}
