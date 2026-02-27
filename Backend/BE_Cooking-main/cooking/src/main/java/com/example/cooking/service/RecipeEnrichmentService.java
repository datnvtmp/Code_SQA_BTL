package com.example.cooking.service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.cooking.dto.response.RecipeDetailResponse;
import com.example.cooking.dto.response.RecipeSummaryDTO;
import com.example.cooking.model.Recipe;
import com.example.cooking.dto.projection.CommentCountProjection;
import com.example.cooking.dto.projection.RecipeCategoryProjection;
import com.example.cooking.dto.projection.RecipeLikesProjection;
import com.example.cooking.dto.projection.RecipeSavesProjection;
import com.example.cooking.dto.projection.RecipeTagProjection;
import com.example.cooking.dto.CategoryDTO;
import com.example.cooking.dto.TagDTO;
import com.example.cooking.repository.CollectionRecipeRepository;
import com.example.cooking.repository.CommentRepository;
import com.example.cooking.repository.LikeRepository;
import com.example.cooking.repository.RecipeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecipeEnrichmentService {

    private final RecipeRepository recipeRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final CollectionRecipeRepository collectionRecipeRepository;

    /**
     * Map categories riêng biệt
     */
    public List<RecipeSummaryDTO> mapCategories(List<RecipeSummaryDTO> dtos) {
        if (dtos.isEmpty())
            return dtos;

        Set<Long> recipeIds = dtos.stream()
                .map(RecipeSummaryDTO::getId)
                .collect(Collectors.toSet());

        List<RecipeCategoryProjection> categoryProjections = recipeRepository.findCategoriesByRecipeIds(recipeIds);

        Map<Long, Set<CategoryDTO>> categoriesMap = categoryProjections.stream()
                .collect(Collectors.groupingBy(
                        RecipeCategoryProjection::getRecipeId,
                        Collectors.mapping(this::mapToCategoryDTO,
                                Collectors.toCollection(LinkedHashSet::new))));

        dtos.forEach(dto -> dto.setCategories(categoriesMap.getOrDefault(dto.getId(), new LinkedHashSet<>())));

        return dtos;
    }

    /**
     * Map tags riêng biệt
     */
    public List<RecipeSummaryDTO> mapTags(List<RecipeSummaryDTO> dtos) {
        if (dtos.isEmpty())
            return dtos;

        Set<Long> recipeIds = dtos.stream()
                .map(RecipeSummaryDTO::getId)
                .collect(Collectors.toSet());

        List<RecipeTagProjection> tagProjections = recipeRepository.findTagsByRecipeIds(recipeIds);

        Map<Long, Set<TagDTO>> tagsMap = tagProjections.stream()
                .collect(Collectors.groupingBy(
                        RecipeTagProjection::getRecipeId,
                        Collectors.mapping(this::mapToTagDTO,
                                Collectors.toCollection(LinkedHashSet::new))));

        dtos.forEach(dto -> dto.setTags(tagsMap.getOrDefault(dto.getId(), new LinkedHashSet<>())));

        return dtos;
    }

    /**
     * Hàm tổng hợp: map categories, tags, likes, commentCount cùng lúc
     * Tối ưu bằng cách chỉ extract recipeIds 1 lần
     */
    public List<RecipeSummaryDTO> enrichAllForRecipeSummaryDTOs(List<RecipeSummaryDTO> dtos, Long currentUserId) {
        if (dtos.isEmpty())
            return dtos;

        Set<Long> recipeIds = dtos.stream()
                .map(RecipeSummaryDTO::getId)
                .collect(Collectors.toSet());

        // Fetch all data cùng lúc
        List<RecipeCategoryProjection> categoryProjections = recipeRepository.findCategoriesByRecipeIds(recipeIds);
        List<RecipeTagProjection> tagProjections = recipeRepository.findTagsByRecipeIds(recipeIds);
        List<CommentCountProjection> commentCountProjections = commentRepository.countCommentsByRecipeIds(recipeIds);
        List<RecipeLikesProjection> likeProjections = likeRepository.countLikeAndfindLikedByUser(recipeIds, currentUserId);
        List<RecipeSavesProjection> saveProjections = collectionRecipeRepository.countSavesAndCheckUserSaved(recipeIds, currentUserId);
        // Build maps
        Map<Long, Set<CategoryDTO>> categoriesMap = categoryProjections.stream()
                .collect(Collectors.groupingBy(
                        RecipeCategoryProjection::getRecipeId,
                        Collectors.mapping(this::mapToCategoryDTO,
                                Collectors.toCollection(LinkedHashSet::new))));

        Map<Long, Set<TagDTO>> tagsMap = tagProjections.stream()
                .collect(Collectors.groupingBy(
                        RecipeTagProjection::getRecipeId,
                        Collectors.mapping(this::mapToTagDTO,
                                Collectors.toCollection(LinkedHashSet::new))));


        Map<Long, Long> commentCountMap = commentCountProjections.stream()
                .collect(Collectors.toMap(
                        CommentCountProjection::getRecipeId,
                        CommentCountProjection::getCommentCount));

        
        Map<Long, RecipeLikesProjection> likeMap = likeProjections.stream()
                .collect(Collectors.toMap(
                        RecipeLikesProjection::getRecipeId,
                        Function.identity()));

        Map<Long, RecipeSavesProjection> saveMap = saveProjections.stream()
                .collect(Collectors.toMap(
                         RecipeSavesProjection::getRecipeId, 
                         Function.identity()));

        // Inject vào DTOs
        dtos.forEach(dto -> {
            Long recipeId = dto.getId();
            dto.setCategories(categoriesMap.getOrDefault(recipeId, new LinkedHashSet<>()));
            dto.setTags(tagsMap.getOrDefault(recipeId, new LinkedHashSet<>()));
            dto.setCommentCount(commentCountMap.getOrDefault(recipeId, 0L));
            RecipeLikesProjection rl = likeMap.get(recipeId);
            if (rl != null) {
                dto.setLikeCount(rl.getLikeCount());
                dto.setLikedByCurrentUser(rl.getLikedByUser());
            } else {
                dto.setLikeCount(0L);
                dto.setLikedByCurrentUser(false);
            }
            RecipeSavesProjection rs = saveMap.get(recipeId);
            if (rs != null){
                dto.setSaveCount(rs.getSaveCount());
                dto.setSavedByCurrentUser(rs.getSavedByUser());
            } else{
                dto.setSaveCount(0L);
                dto.setSavedByCurrentUser(false);
            }
        });

        return dtos;
    }


    public Page<RecipeSummaryDTO> enrichAllForRecipeSummaryDTOs(Page<RecipeSummaryDTO> dtoPage, Pageable pageable,
            Long currentUserId) {
        List<RecipeSummaryDTO> enrichedContent = enrichAllForRecipeSummaryDTOs(dtoPage.getContent(), currentUserId);
        return new PageImpl<>(enrichedContent, pageable, dtoPage.getTotalElements());
    }

    public RecipeDetailResponse enrichForDetailResponse(RecipeDetailResponse dto, Long currentUserId){
        if (dto == null)
            return null;

        Long recipeId = dto.getId();

        // Fetch data
        RecipeLikesProjection likeProjection = likeRepository.getLikesOfRecipe(recipeId, currentUserId);
        RecipeSavesProjection saveProjection = collectionRecipeRepository.countSavesAndCheckUserSavedForRecipe(recipeId, currentUserId);
        Long commentCount = commentRepository.countByRecipeId(recipeId);
        // Inject vào DTO
        if (likeProjection != null){
            dto.setLikeCount(likeProjection.getLikeCount());
            dto.setLikedByCurrentUser(likeProjection.getLikedByUser());
        } else {
            dto.setLikeCount(0L);
            dto.setLikedByCurrentUser(false);
        }
        if (saveProjection != null){
            dto.setSaveCount(saveProjection.getSaveCount());
            dto.setSavedByCurrentUser(saveProjection.getSavedByUser());
        } else {
            dto.setSaveCount(0L);
            dto.setSavedByCurrentUser(false);
        }
        dto.setCommentCount(commentCount);
        return dto;
    }

    // Private mapping methods
    private CategoryDTO mapToCategoryDTO(RecipeCategoryProjection projection) {
        return new CategoryDTO(
                projection.getCategoryId(),
                projection.getCategoryName(),
                projection.getCategorySlug(),
                projection.getCategoryDescription(),
                projection.getCategoryImageUrl());
    }

    private TagDTO mapToTagDTO(RecipeTagProjection projection) {
        return new TagDTO(
                projection.getTagId(),
                projection.getTagName(),
                projection.getTagSlug());
    }
}