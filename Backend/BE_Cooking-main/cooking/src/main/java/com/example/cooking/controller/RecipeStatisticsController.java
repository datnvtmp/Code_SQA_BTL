package com.example.cooking.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cooking.common.ApiResponse;
import com.example.cooking.dto.DailyTotalLikeStat;
import com.example.cooking.dto.DailyTotalViewStat;
import com.example.cooking.dto.response.RecipeLikeStatsResponse;
import com.example.cooking.dto.response.RecipeStatisticsDTO;
import com.example.cooking.dto.response.RecipeViewStatsResponse;
import com.example.cooking.security.MyUserDetails;
import com.example.cooking.service.RecipeService;
import com.example.cooking.service.RecipeStatsService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/statistics") // root path gọn gàng, hợp lý
@RequiredArgsConstructor
public class RecipeStatisticsController {
    private final RecipeStatsService recipeStatsService;

        @GetMapping
    @Operation(
        summary = "Thống kê công thức của người dùng",
        description = "API cho phép người dùng lấy thống kê về số lượng công thức đã tạo, đã được duyệt và chưa được duyệt."
    )
    public ResponseEntity<ApiResponse<RecipeStatisticsDTO>> getMyRecipeStatistics(
            @AuthenticationPrincipal MyUserDetails currentUser) {
        RecipeStatisticsDTO stats = recipeStatsService.getStatisticsForUser(currentUser.getId());
        return ApiResponse.ok(stats);
    }

    @GetMapping("/recipes/views")
    //nhan vao ngay, tra ve
    @Operation(
        summary = "Thống kê lượt xem công thức trong những ngày gần đây",
        description = "API cho phép người dùng lấy thống kê về lượt xem các công thức của họ trong một khoảng thời gian nhất định."
    )
    public List<DailyTotalViewStat> getDailyTotalViewStats(
            @AuthenticationPrincipal MyUserDetails currentUser,
            @RequestParam(required = false, defaultValue = "7") Integer daysBack
    ) {
        return recipeStatsService.getDailyTotalViewStats(currentUser.getId(), daysBack);
    }

    @GetMapping("/{recipeId}/views")
    @Operation(
        summary = "Thống kê lượt xem theo ngày của một công thức",
        description = "Trả về lượt xem của recipe theo từng ngày trong n ngày gần nhất, đồng thời trả tổng lượt xem."
    )
    public RecipeViewStatsResponse getRecipeViewsStats(
        @AuthenticationPrincipal MyUserDetails currentUser,
            @PathVariable Long recipeId,
            @RequestParam(required = false, defaultValue = "7") Integer daysBack
    ) {
        return recipeStatsService.getRecipeStatsResponse(recipeId, daysBack, currentUser);
    }

    @GetMapping("/recipes/likes")
    public List<DailyTotalLikeStat> getAuthorLikeStats(
            @AuthenticationPrincipal MyUserDetails currentUser,
            @RequestParam(defaultValue = "7") Integer daysBack
    ) {
        return recipeStatsService.getDailyTotalLikeStats(currentUser.getId(), daysBack);
    }

    @GetMapping("/{recipeId}/likes")
    public RecipeLikeStatsResponse getRecipeLikeStats(
            @AuthenticationPrincipal MyUserDetails currentUser,
            @PathVariable Long recipeId,
            @RequestParam(defaultValue = "7") Integer daysBack
    ) {
        return recipeStatsService.getRecipeLikesResponse(recipeId, daysBack, currentUser);
    }

}