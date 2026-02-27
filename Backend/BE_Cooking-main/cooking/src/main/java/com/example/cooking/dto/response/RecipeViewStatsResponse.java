package com.example.cooking.dto.response;

import com.example.cooking.dto.projection.RecipeDailyStat;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RecipeViewStatsResponse {
    private List<RecipeDailyStat> dailyStats; // Lượt xem theo từng ngày
    private Long totalViews;                  // Tổng lượt xem
}
