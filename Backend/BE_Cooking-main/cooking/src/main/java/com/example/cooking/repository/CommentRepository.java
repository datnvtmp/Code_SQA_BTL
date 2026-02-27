package com.example.cooking.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.cooking.dto.projection.CommentCountProjection;
import com.example.cooking.dto.projection.ReplyCountCommentProjection;
import com.example.cooking.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

  // boolean existsById(Long id);

  @EntityGraph(attributePaths = { "user" }) // TODO: check lai, join hơi nhieu, nhat là thua recipe
  // page các comment cha của 1 recipe
  Page<Comment> findByRecipeIdAndParentCommentIsNull(Long recipeId, Pageable pageable);
  // Lấy tất cả reply của 1 comment cha

  @EntityGraph(attributePaths = { "user" })
  Page<Comment> findByParentCommentIdOrderByCreatedAtAsc(Long parentId, Pageable pageable);

      @Query("SELECT c.recipe.id FROM Comment c WHERE c.id = :commentId")
    Optional<Long> findRecipeIdByCommentId(@Param("commentId") Long commentId);


  @Query("""
      SELECT c.parentComment.id as commentId, COUNT(c.id) as replyCount
      FROM Comment c
      WHERE c.parentComment.id IN :commentIds
      GROUP BY c.parentComment.id
      """)
  List<ReplyCountCommentProjection> countRepliesByParentIds(List<Long> commentIds);

  
  @Query("""
          SELECT c.recipe.id AS recipeId, COUNT(c.id) AS commentCount
          FROM Comment c
          WHERE c.recipe.id IN :recipeIds
          GROUP BY c.recipe.id
      """)
  List<CommentCountProjection> countCommentsByRecipeIds(@Param("recipeIds") Set<Long> recipeIds);

  @Query("SELECT COUNT(c.id) FROM Comment c WHERE c.recipe.id = :recipeId")
  Long countByRecipeId(Long recipeId);

}
