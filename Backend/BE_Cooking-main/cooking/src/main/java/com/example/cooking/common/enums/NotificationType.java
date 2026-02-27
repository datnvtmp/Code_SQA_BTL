package com.example.cooking.common.enums;

public enum NotificationType {
    LIKE,           // Khi ai đó like recipe hoặc comment
    COMMENT,        // Khi ai đó comment hoặc reply
    FOLLOW,         // Khi ai đó follow user
    MESSAGE,        // Khi nhận được tin nhắn mới
    RECIPE_APPROVED, // Khi recipe được duyệt (nếu có quy trình duyệt)
    MENTION         // Khi được nhắc đến trong comment hoặc message
}