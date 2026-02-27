package com.example.cooking.dto;

import java.time.LocalDate;
import java.util.List;

import com.example.cooking.dto.projection.RecipeDailyStat;

import lombok.Data;

@Data
public class DailyTotalViewStat {
    private LocalDate date;
    private Long totalView;
    private List<RecipeDailyStat> details;

    public DailyTotalViewStat(LocalDate date, Long totalView, List<RecipeDailyStat> details) {
        this.date = date;
        this.totalView = totalView;
        this.details = details;
    }
}
