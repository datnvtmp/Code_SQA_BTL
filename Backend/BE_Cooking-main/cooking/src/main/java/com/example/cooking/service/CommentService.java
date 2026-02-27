package com.example.cooking.service;

import com.example.cooking.model.Comment;
import com.example.cooking.model.User;
import com.example.cooking.repository.CommentLikeRepository;
import com.example.cooking.repository.CommentRepository;
import com.example.cooking.repository.RecipeRepository;
import com.example.cooking.repository.UserRepository;
import com.example.cooking.security.MyUserDetails;
import com.example.cooking.common.PageDTO;
import com.example.cooking.dto.CommentDTO;
import com.example.cooking.dto.mapper.CommentMapper;
import com.example.cooking.dto.projection.LikeCountCommentProjection;
import com.example.cooking.dto.projection.ReplyCountCommentProjection;
import com.example.cooking.dto.request.CommentRequestDTO;
import com.example.cooking.event.RecipeCommentedEvent;

import lombok.RequiredArgsConstructor;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final RecipeRepository recipeRepository;
    private final CommentMapper commentMapper;
    private final UserRepository userRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final AccessService accessService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public CommentDTO createCommentOnRecipe(Long recipeId, CommentRequestDTO dto, MyUserDetails currentUser) {
        // Lấy thông tin người dùng hiện tại từ SecurityContext
        User user = userRepository.getReferenceById(currentUser.getId());
        accessService.checkRecipeAccess(recipeId, currentUser.getId());
        // Tạo Comment entity
        Comment comment = commentMapper.toEntity(dto);
        comment.setUser(user);
        comment.setRecipe(recipeRepository.getReferenceById(recipeId));
        comment.setParentComment(null); // Bình luận trực tiếp trên công thức không có bình luận cha
        // Lưu bình luận
        comment = commentRepository.save(comment);
        //publish event
        eventPublisher.publishEvent(new RecipeCommentedEvent(user, currentUser.getMyUserName(),recipeRepository.getReferenceById(recipeId),comment));
        return commentMapper.toResponseDTO(comment);
    }

    @Transactional
    public CommentDTO createCommentReply(Long parrentCommentId, CommentRequestDTO dto, MyUserDetails currentUser) {
        // Lấy thông tin người dùng hiện tại từ SecurityContext
        User user = userRepository.getReferenceById(currentUser.getId());
        // Lấy comment cha
        Comment parentComment = commentRepository.findById(parrentCommentId)
                .orElseThrow(() -> new EntityNotFoundException("Parent comment not found"));

        // Tạo Comment entity
        Comment comment = commentMapper.toEntity(dto);
        comment.setUser(user);
        comment.setRecipe(parentComment.getRecipe());
        comment.setParentComment(parentComment);
        // Lưu bình luận
        comment = commentRepository.save(comment);
        return commentMapper.toResponseDTO(comment);
    }

    @Transactional(readOnly = true)
    public PageDTO<CommentDTO> getCommentsByRecipe(MyUserDetails currentUser, Long recipeId, int page, int size) {
        User user = userRepository.getReferenceById(currentUser.getId());
        accessService.checkRecipeAccess(recipeId, user.getId());
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> commentPage = commentRepository.findByRecipeIdAndParentCommentIsNull(recipeId, pageable);
        List<CommentDTO> commentDTOs = enrichCommentDTOs(commentPage.getContent(),
                currentUser == null ? null : currentUser.getId());
        return new PageDTO<>(commentPage, commentDTOs);
    }

    @Transactional(readOnly = true)
    public PageDTO<CommentDTO> getChildCommentsByParentCommentId(MyUserDetails currentUser, Long parentCommentId,
            int page, int size) {

        User user = userRepository.getReferenceById(currentUser.getId());
        Long recipeId = commentRepository.findRecipeIdByCommentId(parentCommentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));
        //check quyen
        accessService.checkRecipeAccess(recipeId, user.getId());
        /////////////////////////////
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> commentPage = commentRepository.findByParentCommentIdOrderByCreatedAtAsc(parentCommentId,
                pageable);
        List<CommentDTO> commentDTOs = enrichCommentDTOs(commentPage.getContent(),
                currentUser == null ? null : currentUser.getId());
        return new PageDTO<>(commentPage, commentDTOs);
    }

    @Transactional(readOnly = true)
    public List<CommentDTO> enrichCommentDTOs(List<Comment> comments, Long currentUserId) {
        if (comments.isEmpty())
            return Collections.emptyList();
        List<CommentDTO> dtos = commentMapper.totoResponseDTOList(comments);

        List<Long> commentIds = comments.stream()
                .map(Comment::getId)
                .collect(Collectors.toList());

        List<LikeCountCommentProjection> likeCounts = commentLikeRepository.countLikesByCommentIds(commentIds,
                currentUserId);
        List<ReplyCountCommentProjection> replyCounts = commentRepository.countRepliesByParentIds(commentIds);

        Map<Long, LikeCountCommentProjection> likesCountMap = likeCounts.stream()
                .collect(Collectors.toMap(
                        LikeCountCommentProjection::getCommentId,
                        Function.identity()));
        Map<Long, Long> replyCountMap = replyCounts.stream()
                .collect(Collectors.toMap(
                        ReplyCountCommentProjection::getCommentId,
                        ReplyCountCommentProjection::getReplyCount));

        // inject
        dtos.forEach(c -> {
            Long commentId = c.getId();
            c.setReplyCount(replyCountMap.getOrDefault(commentId, 0L));
            LikeCountCommentProjection likeCountProjection = likesCountMap.get(commentId);
            if (likeCountProjection != null) {
                c.setLikeCount(likeCountProjection.getLikeCount());
                c.setLikedByCurrentUser(likeCountProjection.getLikedByUser());
            } else {
                c.setLikeCount(0L);
                c.setLikedByCurrentUser(false);
            }
        });
        return dtos;
    }

    @Transactional
    public CommentDTO updateComment(Long commentId, CommentRequestDTO dto, MyUserDetails currentUser) {
        // WARN: Lưu ý, vẫn update được nếu không có quyền xem recipe
        // Lấy thông tin người dùng hiện tại
        User user = userRepository.getReferenceById(currentUser.getId());
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        // Kiểm tra quyền chỉnh sửa
        if (!comment.getUser().getId().equals(user.getId())) {
            throw new SecurityException("You can only edit your own comments");
        }

        // Cập nhật nội dung
        comment.setContent(dto.getContent());
        comment = commentRepository.save(comment);
        return commentMapper.toResponseDTO(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, MyUserDetails currentUser) {
        //TODO:  WARN: Lưu ý, vẫn delete được nếu không có quyền xem recipe
        // Lấy thông tin người dùng hiện tại
        User user = userRepository.getReferenceById(currentUser.getId());
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        // Kiểm tra quyền xóa
        if (!comment.getUser().getId().equals(user.getId())) {
            throw new SecurityException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }
}