package com.example.cooking.controller;

import com.example.cooking.common.ApiResponse;
import com.example.cooking.common.PageDTO;
import com.example.cooking.dto.DishDTO;
import com.example.cooking.dto.request.DishCreateDTO;
import com.example.cooking.security.MyUserDetails;
import com.example.cooking.service.DishService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dishs")
@RequiredArgsConstructor
public class DishController {

    private final DishService dishService;

    @PreAuthorize("hasRole('CHEF')")
    @PostMapping(path = "/create", consumes = {"multipart/form-data"})
    public ResponseEntity<ApiResponse<DishDTO>> createDish(
            @AuthenticationPrincipal MyUserDetails currentUser,
            @Valid @ModelAttribute DishCreateDTO dto
    ) {
        return ApiResponse.ok(dishService.addDish(dto, currentUser));
    }

    @PreAuthorize("hasRole('CHEF')")
    @PutMapping("/{dishId}")
    public ResponseEntity<ApiResponse<DishDTO>> updateDish(
            @AuthenticationPrincipal MyUserDetails currentUser,
            @PathVariable Long dishId,
            @RequestBody DishCreateDTO dto
    ) {
        return ApiResponse.ok(dishService.updateDish(dishId, dto, currentUser));
    }

    @PreAuthorize("hasRole('CHEF')")
    @DeleteMapping("/{dishId}")
    public ResponseEntity<ApiResponse<Void>> deleteDish(@AuthenticationPrincipal MyUserDetails currentUser, @PathVariable Long dishId) {
        dishService.deleteDish(dishId, currentUser);
        return ApiResponse.ok(null);
    }

    
    @GetMapping("/recipe/{recipeId}")
    public ResponseEntity<ApiResponse<PageDTO<DishDTO>>> getDishByRecipe(
            @PathVariable Long recipeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.ok(dishService.getDishByRecipe(recipeId, page, size));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<PageDTO<DishDTO>>> getDishByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.ok(dishService.getDishByUser(userId, page, size));
    }

    @GetMapping("/{dishId}")
    public ResponseEntity<ApiResponse<DishDTO>> getDishById(
            @PathVariable Long dishId
    ) {
        return ApiResponse.ok(dishService.getDishById(dishId));
    }

        // --- Bật/tắt món ---
        @PreAuthorize("hasRole('CHEF')")
    @PutMapping("/{dishId}/toggle-status")
    public ResponseEntity<ApiResponse<DishDTO>> toggleDishStatus(
            @AuthenticationPrincipal MyUserDetails currentUser,
            @PathVariable Long dishId
    ) {
        return ApiResponse.ok(dishService.toggleDishStatus(dishId, currentUser));
    }

        // --- Thêm số lượng món ---
        @PreAuthorize("hasRole('CHEF')")
    @PutMapping("/{dishId}/add-servings")
    public ResponseEntity<ApiResponse<DishDTO>> addServings(
            @AuthenticationPrincipal MyUserDetails currentUser,
            @PathVariable Long dishId,
            @RequestParam Long additionalServings
    ) {
        return ApiResponse.ok(dishService.addRemainingServings(dishId, additionalServings, currentUser));
    }

        // --- Bật/tắt tất cả món của user ---
        @PreAuthorize("hasRole('CHEF')")
    @PutMapping("/toggle-all")
    public ResponseEntity<ApiResponse<String>> toggleAllDishes(
            @AuthenticationPrincipal MyUserDetails currentUser,
            @RequestParam boolean activate
    ) {
        dishService.toggleAllDishesForUser(currentUser, activate);
        return ApiResponse.ok("Da thuc hien");
    }

    // @Operation(
    //     summary = "Tìm kiếm món",
    //     description = "API cho phép tìm kiếm món ăn dựa trên từ khóa với phân trang và sắp xếp."
    // )
    // @GetMapping("/search")
    // public ResponseEntity<ApiResponse<PageDTO<UserDTO>>> searchUsers(
    //         @RequestParam(defaultValue = "") String keyword,
    //         @RequestParam(defaultValue = "0") int page,
    //         @RequestParam(defaultValue = "10") int size,
    //         @RequestParam(defaultValue = "username") String sortBy,
    //         @RequestParam(defaultValue = "asc") String sortDir) {

    //     PageDTO<UserDTO> userPage = dishService.searchUsers(keyword, page, size, sortBy, sortDir);
    //     return ApiResponse.ok(userPage);
    // }

}

