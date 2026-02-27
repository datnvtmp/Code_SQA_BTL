package com.example.cooking.controller.admin;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cooking.common.ApiResponse;
import com.example.cooking.common.PageDTO;
import com.example.cooking.common.enums.Scope;
import com.example.cooking.common.enums.Status;
import com.example.cooking.dto.mapper.RecipeMapper;
import com.example.cooking.dto.response.ChefRequestResponseDTO;
import com.example.cooking.dto.response.RecipeDetailResponse;
import com.example.cooking.dto.response.RecipeSummaryDTO;
import com.example.cooking.model.ChefRequest;
import com.example.cooking.security.MyUserDetails;
import com.example.cooking.service.AdminService;
import com.example.cooking.service.ChefRequestService;
import com.example.cooking.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {
    private final AdminService adminService;
    private final RecipeService recipeService;
    private final RecipeMapper recipeMapper;
    private final ChefRequestService chefRequestService;

    @GetMapping("/welcome")
    public ResponseEntity<ApiResponse<String>> welcomeAdmin() {
        return ApiResponse.ok("Welcome to the ToDo App!/ADMIN");
    }

    @PatchMapping("/recipe/{id}/status")
    public ResponseEntity<ApiResponse<String>> setRecipeStatus(@PathVariable Long id,
            @RequestParam Status status) {
        adminService.setRecipeStatus(id, status);
        return ApiResponse.ok("Dat trang thai thanh cong");
    }

    @GetMapping("/admin/recipes")
    @PreAuthorize("hasRole('ADMIN')") // hoặc annotation tùy cấu hình bảo mật của bạn
    public ResponseEntity<ApiResponse<PageDTO<RecipeSummaryDTO>>> getAllRecipesForAdmin(
            @AuthenticationPrincipal MyUserDetails currentUser,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Scope scope,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "views") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        PageDTO<RecipeSummaryDTO> result = recipeService.getAllRecipesForAdmin(currentUser.getId(),status, scope, keyword, pageable);

        return ApiResponse.ok(result);
    }

    @GetMapping("/recipe/{id}")
    public ResponseEntity<ApiResponse<RecipeDetailResponse>> getRecipeById(@PathVariable Long id) {
        RecipeDetailResponse recipeResponse = recipeMapper.toRecipeResponse(recipeService.getRecipeById(id));
        return ApiResponse.ok(recipeResponse);
    }
    // //hàm cho thống kê    
    // @GetMapping("/statistics")
    // public ResponseEntity<ApiResponse<RecipeStatisticsDTO>> getRecipeStatistics() {
    //     return ApiResponse.ok(recipeService.getRecipeStatistics());
    // }

    /**
     * Admin xem tất cả request
     */
    @GetMapping("/chef/requests")
    public ResponseEntity<ApiResponse<PageDTO<ChefRequestResponseDTO>>> getAllRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        PageDTO<ChefRequestResponseDTO> requests = chefRequestService.getAllRequests(pageable);
        return ApiResponse.ok(requests);
    }

    /**
     * Admin duyệt request
     */
    @PostMapping("/chef/approve/{requestId}")
    public ResponseEntity<?> approveRequest(@PathVariable Long requestId) {
        ChefRequest request = chefRequestService.approveRequest(requestId);
        
        return ApiResponse.ok("Đã duyệt yêu cầu thành công, " + request.getUser().getUsername() + " hiện đã là CHEF.");
    }

    /**
     * Admin từ chối request
     */
    @PostMapping("/chef/reject/{requestId}")
    public ResponseEntity<?> rejectRequest(@PathVariable Long requestId,
                                           @RequestParam String note) {
        ChefRequest request = chefRequestService.rejectRequest(requestId, note);
        return ApiResponse.ok("Đã từ chối yêu cầu thành công, " + request.getUser().getUsername() + " không trở thành CHEF.");
    }
}
