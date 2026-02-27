// src/main/java/com/example/cooking/dto/admin/DashboardStatsDto.java
package com.example.cooking.dto.admin;

import java.time.LocalDate;
import java.util.List;

public record DashboardStatsDto(
    // 1. Users
    Long totalUsers,
    Long newUsersToday,
    Long bannedUsers,

    // 2. Recipes
    Long totalRecipes,
    Long pendingRecipes,
    Long approvedRecipes,
    Long rejectedRecipes,

    // 3. Activities (last 24h)
    Long viewsLast24h,
    Long likesLast24h,
    Long commentsLast24h,

    // 4. Growth Chart - 30 ngày gần nhất
    List<DailyGrowth> userGrowthLast30Days,
    List<DailyGrowth> recipeGrowthLast30Days,

    // 5. Top 10 Hot Recipes
    List<TopRecipe> top10RecipesByViews,
    List<TopRecipe> top10RecipesByLikes,

    // 6. Top 10 Active Users
    List<TopUser> top10ActiveUsers
) {
    public record DailyGrowth(LocalDate date, Long count) {}
    public record TopRecipe(Long recipeId, String title, String imageUrl, Long value) {}
    public record TopUser(Long userId, String username, String avatarUrl, Long recipeCount, Long likeCount) {}
}