package com.example.cooking.dto.projection;

public interface LikeCountCommentProjection {
    Long getLikeCount();
    Long getCommentId();
    Boolean getLikedByUser();
}
