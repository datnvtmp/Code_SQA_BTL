package com.example.cooking.dto.projection;

import com.example.cooking.common.enums.Status;

public interface RecipeStatusCount {
    Status getStatus();
    Long getCount();
}

