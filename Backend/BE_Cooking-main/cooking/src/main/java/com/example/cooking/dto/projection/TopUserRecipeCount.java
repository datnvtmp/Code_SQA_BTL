package com.example.cooking.dto.projection;

import com.example.cooking.model.User;

public interface TopUserRecipeCount {
    User getUser();
    Long getRecipeCount();
}

