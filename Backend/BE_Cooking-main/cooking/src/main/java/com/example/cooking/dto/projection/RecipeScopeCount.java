package com.example.cooking.dto.projection;

import com.example.cooking.common.enums.Scope;

public interface RecipeScopeCount {
    Scope getScope();
    Long getCount();
}