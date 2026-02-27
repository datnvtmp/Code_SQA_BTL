package com.example.cooking.dto;

import java.time.LocalDateTime;

import com.example.cooking.common.enums.NotificationType;

import lombok.Data;


@Data
public class NotificationDTO {
    private Long id;
    private NotificationType type;  // Loại thông báo (LIKE, COMMENT, FOLLOW, v.v.)
    private String content;  // Nội dung thông báo (e.g., "UserX liked your recipe")
    private boolean isRead = false;
    private LocalDateTime createdAt;
    private Long recipeId;  // Liên quan đến recipe (nếu có)
    private Long commentId;  // Liên quan đến comment (nếu có)
    private Long actorId;
}
