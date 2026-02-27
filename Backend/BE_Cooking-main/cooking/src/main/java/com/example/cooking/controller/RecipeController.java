package com.example.cooking.controller;

import java.time.LocalDateTime;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.example.cooking.common.ApiResponse;
import com.example.cooking.common.PageDTO;
import com.example.cooking.common.enums.Scope;
import com.example.cooking.common.enums.Status;
import com.example.cooking.dto.projection.RecipeDailyStat;
import com.example.cooking.dto.request.NewRecipeRequest;
import com.example.cooking.dto.request.UpdateRecipeRequest;
import com.example.cooking.dto.response.RecipeDetailResponse;
import com.example.cooking.dto.response.RecipeSummaryDTO;
import com.example.cooking.security.MyUserDetails;
import com.example.cooking.service.RecipeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {
    private final RecipeService recipeService;

    @PostMapping(consumes = { "multipart/form-data" })
    @PreAuthorize("hasRole('CHEF')")
    public ResponseEntity<ApiResponse<String>> createRecipe(
            @Valid @ModelAttribute NewRecipeRequest newRecipeRequest,
            @AuthenticationPrincipal MyUserDetails currentUser) {
        Long recipeId = recipeService.addNewRecipe(currentUser, newRecipeRequest);
        return ApiResponse.ok("Created recipe with ID: " + recipeId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> updateRecipe(
            @PathVariable Long id,
            @ModelAttribute @Valid UpdateRecipeRequest request,
            @AuthenticationPrincipal MyUserDetails currentUser) {
        Long recipeId = recipeService.updateRecipe(id, currentUser, request);
        return ApiResponse.ok("Da update");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteRecipe(@PathVariable Long id,
            @AuthenticationPrincipal MyUserDetails userDetails) {
        recipeService.deleteRecipe(id, userDetails);
        return ApiResponse.ok("Da xoa");
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('CHEF')")
    public ResponseEntity<ApiResponse<String>> setRecipeStatus(
            @PathVariable Long id,
            @RequestParam Scope scope,
            @AuthenticationPrincipal MyUserDetails currentUser) {
        recipeService.setRecipeScope(currentUser, id, scope);
        return ApiResponse.ok("Recipe visibility updated successfully");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<RecipeDetailResponse>> getRecipeById(
            @PathVariable Long id,
            @AuthenticationPrincipal MyUserDetails currentUser) {
        RecipeDetailResponse recipe = recipeService.getRecipeDetailById(id, currentUser);
        return ApiResponse.ok(recipe);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CHEF')")
    public ResponseEntity<ApiResponse<PageDTO<RecipeSummaryDTO>>> getMyRecipes(
            @AuthenticationPrincipal MyUserDetails currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        PageDTO<RecipeSummaryDTO> recipes = recipeService.getMyRecipes(currentUser, pageable);
        return ApiResponse.ok(recipes);
    }

    @GetMapping("/following-recipes")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<PageDTO<RecipeSummaryDTO>>> getMyFollingRecipes(
            @AuthenticationPrincipal MyUserDetails currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        PageDTO<RecipeSummaryDTO> recipes = recipeService.getMyFollingRecipes(currentUser, pageable);
        return ApiResponse.ok(recipes);
    }

    // TODO: khong truyen date thi de 7 ngay
@GetMapping("/top-like-recipes")
@PreAuthorize("hasRole('USER')")
public ResponseEntity<ApiResponse<PageDTO<RecipeSummaryDTO>>> getTopLikeRecipes(
        @AuthenticationPrincipal MyUserDetails currentUser,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

    // Xử lý giá trị mặc định ngay tại Controller để rõ ràng
    LocalDateTime finalEnd = (endDate == null) ? LocalDateTime.now() : endDate;
    LocalDateTime finalStart = (startDate == null) ? finalEnd.minusDays(7) : startDate;

    Pageable pageable = PageRequest.of(page, size);
    PageDTO<RecipeSummaryDTO> recipes = recipeService.getTopLikeRecipes(currentUser, finalStart, finalEnd, pageable);
    
    return ApiResponse.ok(recipes);
}

    // TODO: khong truyen date thi de 7 ngay
    @GetMapping("/top-new-recipes")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<PageDTO<RecipeSummaryDTO>>> getTopViewRecipes(
            @AuthenticationPrincipal MyUserDetails currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        // Xử lý logic mặc định 7 ngày nếu không có date
        if (endDate == null) {
            endDate = LocalDateTime.now();
        }
        if (startDate == null) {
            startDate = endDate.minusDays(7);
        }

        Pageable pageable = PageRequest.of(page, size);
        PageDTO<RecipeSummaryDTO> recipes = recipeService.getTopViewRecipes(currentUser, startDate, endDate, pageable);

        return ApiResponse.ok(recipes);
    }

    @GetMapping("/liked")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<PageDTO<RecipeSummaryDTO>>> getMyLikedRecipes(
            @AuthenticationPrincipal MyUserDetails currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        PageDTO<RecipeSummaryDTO> recipes = recipeService.getMyLikedRecipes(currentUser, pageable);
        return ApiResponse.ok(recipes);
    }

    @GetMapping("/liked/user/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<PageDTO<RecipeSummaryDTO>>> getLikedRecipesByUserId(
            @AuthenticationPrincipal MyUserDetails currentUser,
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        PageDTO<RecipeSummaryDTO> recipes = recipeService.getLikedRecipesByUserId(currentUser, userId, pageable);
        return ApiResponse.ok(recipes);
    }

    @GetMapping("/recent")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<PageDTO<RecipeSummaryDTO>>> getMyRecentlyViewedRecipes(
            @AuthenticationPrincipal MyUserDetails currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        PageDTO<RecipeSummaryDTO> recipes = recipeService.getMyRecentlyViewedRecipes(currentUser, pageable);

        return ApiResponse.ok(recipes);
    }

    /**
     * Lấy danh sách công thức của tôi
     * Hỗ trợ lọc: status, scope, keyword
     * Ví dụ:
     * - Đang chờ duyệt: ?status=PENDING
     * - Công khai: ?scope=PUBLIC
     * - Nháp: ?scope=DRAFT
     * - Đã bị từ chối: ?status=REJECTED
     * - Tìm "phở": ?keyword=phở
     */
    // 🔹 Endpoint lọc linh hoạt
    @GetMapping("/my-recipes/filter")
    @PreAuthorize("hasRole('CHEF')")
    public ResponseEntity<ApiResponse<PageDTO<RecipeSummaryDTO>>> getMyRecipes(
            @AuthenticationPrincipal MyUserDetails currentUser,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Scope scope,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "views") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Pageable pageable = createPageable(page, size, sortBy, direction);

        PageDTO<RecipeSummaryDTO> result = recipeService.getMyRecipes(
                currentUser.getId(), status, scope, keyword, pageable);

        return ApiResponse.ok(result);
    }

    // 🔹 Các endpoint nhanh (tự động dùng sort mặc định là views DESC)
    @GetMapping("/my-recipes/filter/pending")
    @PreAuthorize("hasRole('CHEF')")
    public ResponseEntity<ApiResponse<PageDTO<RecipeSummaryDTO>>> getPending(
            @AuthenticationPrincipal MyUserDetails user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "views") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Pageable pageable = createPageable(page, size, sortBy, direction);
        return ApiResponse.ok(recipeService.getMyRecipes(user.getId(), Status.PENDING, null, null, pageable));
    }

    @GetMapping("/my-recipes/filter/approved")
    @PreAuthorize("hasRole('CHEF')")
    public ResponseEntity<ApiResponse<PageDTO<RecipeSummaryDTO>>> getApproved(
            @AuthenticationPrincipal MyUserDetails user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "views") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Pageable pageable = createPageable(page, size, sortBy, direction);
        return ApiResponse.ok(recipeService.getMyRecipes(user.getId(), Status.APPROVED, null, null, pageable));
    }

    @GetMapping("/my-recipes/filter/rejected")
    @PreAuthorize("hasRole('CHEF')")
    public ResponseEntity<ApiResponse<PageDTO<RecipeSummaryDTO>>> getRejected(
            @AuthenticationPrincipal MyUserDetails user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "views") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Pageable pageable = createPageable(page, size, sortBy, direction);
        return ApiResponse.ok(recipeService.getMyRecipes(user.getId(), Status.REJECTED, null, null, pageable));
    }

    @GetMapping("/my-recipes/filter/drafts")
    @PreAuthorize("hasRole('CHEF')")
    public ResponseEntity<ApiResponse<PageDTO<RecipeSummaryDTO>>> getDrafts(
            @AuthenticationPrincipal MyUserDetails user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "views") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Pageable pageable = createPageable(page, size, sortBy, direction);
        return ApiResponse.ok(recipeService.getMyRecipes(user.getId(), null, Scope.DRAFT, null, pageable));
    }

    @GetMapping("/my-recipes/filter/public")
    @PreAuthorize("hasRole('CHEF')")
    public ResponseEntity<ApiResponse<PageDTO<RecipeSummaryDTO>>> getPublic(
            @AuthenticationPrincipal MyUserDetails user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "views") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Pageable pageable = createPageable(page, size, sortBy, direction);
        return ApiResponse.ok(recipeService.getMyRecipes(user.getId(), Status.APPROVED, Scope.PUBLIC, null, pageable));
    }

    @GetMapping("/user/{userId}/public-recipes")
    @PreAuthorize("hasRole('CHEF')")
    public ResponseEntity<ApiResponse<PageDTO<RecipeSummaryDTO>>> getPublicRecipes(
            @PathVariable Long userId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "views") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Pageable pageable = createPageable(page, size, sortBy, direction);

        PageDTO<RecipeSummaryDTO> result = recipeService.getRecipesByUserId(
                userId, Status.APPROVED, Scope.PUBLIC, keyword, pageable);

        return ApiResponse.ok(result);
    }

    // Hàm tiện ích để tạo Pageable với sort động
    private Pageable createPageable(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        return PageRequest.of(page, size, sort);
    }
}
