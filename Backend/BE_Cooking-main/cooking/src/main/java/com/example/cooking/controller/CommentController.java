package com.example.cooking.controller;

import com.example.cooking.common.ApiResponse;
import com.example.cooking.common.PageDTO;
import com.example.cooking.dto.request.CommentRequestDTO;
import com.example.cooking.dto.CommentDTO;
import com.example.cooking.security.MyUserDetails;
import com.example.cooking.service.CommentLikeService;
import com.example.cooking.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final CommentLikeService commentLikeService;

     // ================== COMMENTS ==================
    @PostMapping("/recipes/{recipeId}/comments")
    public ResponseEntity<ApiResponse<CommentDTO>> createComment(
            @PathVariable Long recipeId,
            @Valid @RequestBody CommentRequestDTO dto,
            @AuthenticationPrincipal MyUserDetails currentUser) {
        CommentDTO response = commentService.createCommentOnRecipe(recipeId, dto, currentUser);
        return ApiResponse.ok(response);
    }

    @GetMapping("/recipes/{recipeId}/comments")
    public ResponseEntity<ApiResponse<PageDTO<CommentDTO>>> getCommentsByRecipe(
            @AuthenticationPrincipal MyUserDetails currentUser,
            @PathVariable Long recipeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageDTO<CommentDTO> comments = commentService.getCommentsByRecipe(currentUser,recipeId, page, size);
        return ApiResponse.ok(comments);
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<ApiResponse<CommentDTO>> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequestDTO dto,
            @AuthenticationPrincipal MyUserDetails currentUser) {
        CommentDTO response = commentService.updateComment(commentId, dto, currentUser);
        return ApiResponse.ok(response);
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<ApiResponse<String>> deleteComment(@PathVariable Long commentId, @AuthenticationPrincipal MyUserDetails currentUser) {
        commentService.deleteComment(commentId, currentUser);
        return ApiResponse.ok("Da xoa comment " + commentId);
    }
  // ================== REPLIES ==================
     @PostMapping("/comments/{parentCommentId}/replies")
    public ResponseEntity<ApiResponse<CommentDTO>> createReply(
            @PathVariable Long parentCommentId,
            @Valid @RequestBody CommentRequestDTO dto,
            @AuthenticationPrincipal MyUserDetails currentUser) {
        CommentDTO response = commentService.createCommentReply(parentCommentId, dto, currentUser);
        return ApiResponse.ok(response);
    }


    @GetMapping("/comment/{parentCommentId}/replies")
    public ResponseEntity<ApiResponse<PageDTO<CommentDTO>>> getChildComments(
            @AuthenticationPrincipal MyUserDetails currentUser,
            @PathVariable Long parentCommentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageDTO<CommentDTO> comments = commentService.getChildCommentsByParentCommentId(currentUser,parentCommentId, page, size);
        
        return ApiResponse.ok(comments);
    }

    // ================== LIKES ==================
    @PostMapping("/comment/{commentId}/like")
    public ResponseEntity<ApiResponse<String>> likeComment(@PathVariable("commentId") Long commentId,
            @AuthenticationPrincipal MyUserDetails currentUser) {
        commentLikeService.likeComment(currentUser, commentId);
        return ApiResponse.ok("Da like comment " + commentId);
    }

    @DeleteMapping("/comments/{commentId}/likes")
    public ResponseEntity<ApiResponse<String>> unLikeComment(@PathVariable("commentId") Long commentId,
            @AuthenticationPrincipal MyUserDetails currentUser) {
        commentLikeService.unlikeComment(currentUser, commentId);
        return ApiResponse.ok("Da unlike comment " + commentId);
    }
}