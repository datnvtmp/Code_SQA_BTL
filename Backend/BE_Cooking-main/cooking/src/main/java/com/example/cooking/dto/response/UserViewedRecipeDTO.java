package com.example.cooking.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserViewedRecipeDTO extends RecipeSummaryDTO {
    private LocalDateTime viewedAt; // thời điểm user xem
}

