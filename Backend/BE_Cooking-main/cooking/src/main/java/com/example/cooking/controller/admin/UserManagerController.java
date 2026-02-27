package com.example.cooking.controller.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cooking.common.ApiResponse;
import com.example.cooking.common.PageDTO;
import com.example.cooking.common.enums.UserStatus;
import com.example.cooking.dto.UserDTO;
import com.example.cooking.dto.UserRecipeCountDTO;
import com.example.cooking.dto.UserTotalViewCountDTO;
import com.example.cooking.service.admin.AdminUserService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/users")
public class UserManagerController {
    private final AdminUserService adminUserService;

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageDTO<UserDTO>>> searchUsers(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "username") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(required = false) String role) {

        PageDTO<UserDTO> userPage = adminUserService.searchUsers(keyword, page, size, sortBy, sortDir, status, role);
        return ApiResponse.ok(userPage);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Cập nhật trạng thái người dùng")
    public ResponseEntity<ApiResponse<UserDTO>> updateUserStatus(
            @PathVariable Long id,
            @RequestParam UserStatus status) {

        UserDTO updatedUser = adminUserService.updateUserStatus(id, status);
        return ApiResponse.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa người dùng")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        adminUserService.deleteUser(id);
        return ApiResponse.ok("User deleted successfully");
    }
    /**
     * Top người đăng nhiều công thức nhất (có phân trang)
     * Default: 30 ngày gần đây
     */
    @GetMapping("/top-posters")
    public ResponseEntity<ApiResponse<PageDTO<UserRecipeCountDTO>>> getTopPosters(
            @RequestParam(defaultValue = "30") Integer days,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageDTO<UserRecipeCountDTO> result = adminUserService.getTopRecipePosters(days, null, null, page, size);
        return ApiResponse.ok(result);
    }

    /**
     * Top người có tổng views cao nhất
     */
    @GetMapping("/top-viewed")
    public  ResponseEntity<ApiResponse<PageDTO<UserTotalViewCountDTO>>>  getTopViewedUsers(
            @RequestParam(defaultValue = "30") Integer days,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageDTO<UserTotalViewCountDTO> result = adminUserService.getTopViewedUsers(days, null, null, page, size);
        return ApiResponse.ok(result);
    }

}
