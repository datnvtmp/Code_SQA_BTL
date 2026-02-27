package com.example.cooking.dto.projection;

import com.example.cooking.model.User;

public interface TopUserTotalViews {
    User getUser();
    Long getTotalViews();
}
