package com.example.cooking.dto.projection;

import java.time.LocalDate;

public interface RecipeDailyStat {
    LocalDate getDate();
    Long getCount();
    Long getRecipeId();
}
