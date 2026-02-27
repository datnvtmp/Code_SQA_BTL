package com.example.cooking.controller.admin;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cooking.common.ApiResponse;
import com.example.cooking.common.PageDTO;
import com.example.cooking.common.enums.Scope;
import com.example.cooking.common.enums.Status;
import com.example.cooking.common.enums.UserStatus;
import com.example.cooking.dto.UserDTO;
import com.example.cooking.dto.UserRecipeCountDTO;
import com.example.cooking.dto.UserTotalViewCountDTO;
import com.example.cooking.dto.response.RecipeSummaryDTO;
import com.example.cooking.security.MyUserDetails;
import com.example.cooking.service.admin.AdminRecipeService;
import com.example.cooking.service.admin.AdminUserService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/recipe-manager")
public class RecipeManagerController {
    private final AdminRecipeService adminRecipeService;

    @GetMapping("/filter")
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

        PageDTO<RecipeSummaryDTO> result = adminRecipeService.getAllRecipesForAdmin(
                currentUser.getId(), status, scope, keyword, pageable);

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
