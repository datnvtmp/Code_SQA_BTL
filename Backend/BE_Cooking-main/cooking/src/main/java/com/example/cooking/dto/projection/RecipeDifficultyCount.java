package com.example.cooking.dto.projection;

import com.example.cooking.common.enums.Difficulty;

public interface RecipeDifficultyCount {
    Difficulty getDifficulty();
    Long getCount();
}
