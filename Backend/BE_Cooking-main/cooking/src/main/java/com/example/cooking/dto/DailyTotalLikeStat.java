package com.example.cooking.dto;

import java.time.LocalDate;
import java.util.List;

import com.example.cooking.dto.projection.RecipeDailyStat;

import lombok.Data;

@Data
public class DailyTotalLikeStat {
    private LocalDate date;
    private Long totalLike;
    private List<RecipeDailyStat> details;

    public DailyTotalLikeStat(LocalDate date, Long totalView, List<RecipeDailyStat> details) {
        this.date = date;
        this.totalLike = totalView;
        this.details = details;
    }
}
