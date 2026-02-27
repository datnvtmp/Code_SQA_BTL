package com.example.cooking.service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.cooking.exception.CustomException;
import com.example.cooking.model.Comment;
import com.example.cooking.model.CommentLike;
import com.example.cooking.model.User;
import com.example.cooking.repository.CommentLikeRepository;
import com.example.cooking.repository.CommentRepository;
import com.example.cooking.repository.UserRepository;
import com.example.cooking.security.MyUserDetails;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentLikeService {
    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final UserRepository userRepository;

    @Transactional
    public void likeComment(MyUserDetails currentUser, Long commentId) {
        User user = userRepository.getReferenceById(currentUser.getId());
       Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException("Khong tim thay comment co id:" + commentId));
        // Check nếu user đã like
        boolean alreadyLiked = commentLikeRepository.existsByUserAndComment(user, comment);
        if (alreadyLiked) {
            throw new CustomException("User already liked this comment");
        }
        CommentLike commentLike = new CommentLike();
        commentLike.setUser(user);
        commentLike.setComment(comment);
        commentLikeRepository.save(commentLike);
    }

    @Transactional
    public void unlikeComment(MyUserDetails currentUser, Long commentId) {
        long deletedCount = commentLikeRepository.deleteByUserIdAndCommentId(currentUser.getId(), commentId);
        if (deletedCount == 0) {
            throw new CustomException("Like not found for user id: " + currentUser.getId() + " and comment id: " + commentId);
        }
        
    }

}
