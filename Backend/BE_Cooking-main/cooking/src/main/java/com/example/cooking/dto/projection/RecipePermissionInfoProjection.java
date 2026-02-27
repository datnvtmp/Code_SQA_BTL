package com.example.cooking.dto.projection;

import com.example.cooking.common.enums.Scope;
import com.example.cooking.common.enums.Status;

/**
 * Projection chỉ lấy những trường cần để check quyền truy cập recipe
 */
public interface RecipePermissionInfoProjection {
    Scope getScope();
    Status getStatus();
    Long getUserId();
}
