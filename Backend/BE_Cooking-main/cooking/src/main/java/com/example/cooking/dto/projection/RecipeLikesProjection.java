package com.example.cooking.dto.projection;

public interface RecipeLikesProjection {
    Long getRecipeId();
    Long getLikeCount();
    Boolean getLikedByUser();
}
