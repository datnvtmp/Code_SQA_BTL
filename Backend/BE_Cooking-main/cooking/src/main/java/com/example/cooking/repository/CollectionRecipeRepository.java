package com.example.cooking.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.cooking.dto.projection.CollectionRecipeCount;
import com.example.cooking.model.CollectionRecipe;
import com.example.cooking.dto.projection.RecipeSavesProjection;
public interface CollectionRecipeRepository extends JpaRepository<CollectionRecipe, Long> {
  // boolean existsByCollectionIdAndRecipeId(Long collectionId, Long recipeId);

  @Query("SELECT CASE WHEN COUNT(cr) > 0 THEN TRUE ELSE FALSE END " +
      "FROM CollectionRecipe cr " +
      "WHERE cr.collection.id = :collectionId AND cr.recipe.id = :recipeId")
  boolean existsByCollectionIdAndRecipeId(@Param("collectionId") Long collectionId,
      @Param("recipeId") Long recipeId);

  Optional<CollectionRecipe> findByCollectionIdAndRecipeId(Long collectionId, Long recipeId);

  @Query("""
          SELECT cr.collection.id AS collectionId, COUNT(cr.id) AS recipeCount
          FROM CollectionRecipe cr
          WHERE cr.collection.id IN :collectionIds
          GROUP BY cr.collection.id
      """)
  List<CollectionRecipeCount> countRecipesByCollectionIds(@Param("collectionIds") List<Long> collectionIds);

  @Query("""
    SELECT COUNT(cr.id)
    FROM CollectionRecipe cr
    WHERE cr.recipe.id = :recipeId
    """)
    long countCollectionsByRecipeId(@Param("recipeId") Long recipeId);

    //dem so save va kiem tra user da save chua
    @Query("""
            SELECT
                cr.recipe.id AS recipeId,
                COUNT(cr.id) AS saveCount,
                SUM(CASE WHEN cr.collection.user.id = :userId THEN 1 ELSE 0 END) > 0 AS savedByUser
            FROM CollectionRecipe cr
            WHERE cr.recipe.id IN :recipeIds
            GROUP BY cr.recipe.id
            """)
    List<RecipeSavesProjection> countSavesAndCheckUserSaved(
            @Param("recipeIds") Set<Long> recipeIds,
            @Param("userId") Long userId);

    @Query("""
        SELECT
            cr.recipe.id AS recipeId,
            COUNT(cr.id) AS saveCount,
            SUM(CASE WHEN cr.collection.user.id = :userId THEN 1 ELSE 0 END) > 0 AS savedByUser
        FROM CollectionRecipe cr
        WHERE cr.recipe.id = :recipeId
        GROUP BY cr.recipe.id
        """)
    RecipeSavesProjection countSavesAndCheckUserSavedForRecipe(
            @Param("recipeId") Long recipeId,
            @Param("userId") Long userId);

            
}
