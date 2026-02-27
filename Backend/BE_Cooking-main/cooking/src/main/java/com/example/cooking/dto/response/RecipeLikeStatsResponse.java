package com.example.cooking.dto.response;

import com.example.cooking.dto.projection.RecipeDailyStat;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RecipeLikeStatsResponse {
    private List<RecipeDailyStat> dailyStats; // Lượt Like theo từng ngày
    private Long totalLike;                  // Tổng lượt like  
}
