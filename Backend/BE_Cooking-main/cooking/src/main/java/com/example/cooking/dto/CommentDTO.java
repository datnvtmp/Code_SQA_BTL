package com.example.cooking.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentDTO {
    private Long id;
    private String content;
    private UserDTO user;
    private Long recipeId;
    private Long parentCommentId;
    private Long replyCount;
    private Long likeCount;
    private Boolean likedByCurrentUser;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}