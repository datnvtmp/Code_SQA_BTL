package com.example.cooking.dto.mapper;

import com.example.cooking.dto.CommentDTO;
import com.example.cooking.dto.request.CommentRequestDTO;
import com.example.cooking.model.Comment;

import java.util.List;
import java.util.Set;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface CommentMapper {

    // Ánh xạ từ CommentRequestDTO sang Comment
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "recipe", ignore = true)
    @Mapping(target = "parentComment", ignore = true)
    @Mapping(target = "replies", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "likes", ignore = true)
    Comment toEntity(CommentRequestDTO dto);

    // Ánh xạ từ Comment sang CommentResponseDTO
    @Mapping(source = "user", target = "user")
    @Mapping(source = "recipe.id", target = "recipeId")
    @Mapping(source = "parentComment.id", target = "parentCommentId")
    @Mapping(target = "likeCount", ignore = true)
    @Mapping(target = "replyCount", ignore = true)
    @Mapping(target = "likedByCurrentUser", ignore = true)
    // @Mapping(source = "replies", target = "replies", qualifiedByName = "toResponseDTOSet")
    CommentDTO toResponseDTO(Comment comment);

    // Ánh xạ danh sách replies
    @Named("toResponseDTOSet")
    Set<CommentDTO> toResponseDTOSet(Set<Comment> comments);
    
    List<CommentDTO> totoResponseDTOList(List<Comment> comments);
}