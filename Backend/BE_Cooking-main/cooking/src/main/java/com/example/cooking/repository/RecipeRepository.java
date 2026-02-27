package com.example.cooking.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.cooking.common.enums.Scope;
import com.example.cooking.common.enums.Status;
import com.example.cooking.dto.projection.RecipeCategoryProjection;
import com.example.cooking.dto.projection.RecipeDifficultyCount;
import com.example.cooking.dto.projection.RecipeIngredientSearchProjection;
import com.example.cooking.dto.projection.RecipePermissionInfoProjection;
import com.example.cooking.dto.projection.RecipeScopeCount;
import com.example.cooking.dto.projection.RecipeStatusCount;
import com.example.cooking.dto.projection.RecipeTagProjection;
import com.example.cooking.model.Recipe;

import jakarta.transaction.Transactional;

public interface RecipeRepository extends JpaRepository<Recipe, Long> , JpaSpecificationExecutor<Recipe> {

//     @EntityGraph(attributePaths = { "user", "steps", "recipeIngredients",
//             "categories",
//             "tags" })
    Optional<Recipe> findById(Long id);

    @Query("SELECT r FROM Recipe r JOIN FETCH r.user WHERE r.user.id = :userId")
    Page<Recipe> findByUserId(Long userId, Pageable pageable);

    // Lấy recipe theo recipeId có cả user luôn
    @Query("""
    SELECT r
    FROM Recipe r
    JOIN FETCH r.user
    WHERE r.id = :recipeId
        """)
        Optional<Recipe> findByIdWithUser(@Param("recipeId") Long recipeId);


    // tuong duong findById nhung khong join fetch
    @Query("SELECT r FROM Recipe r WHERE r.id = :id")
    Optional<Recipe> findSimpleById(@Param("id") Long id);

    // Chỉ lấy user.id từ recipe
    @Query("SELECT r.user.id FROM Recipe r WHERE r.id = :recipeId")
    Optional<Long> findUserIdByRecipeId(@Param("recipeId") Long recipeId);

    // Phương thức tăng view
    @Modifying
    @Transactional
    @Query("UPDATE Recipe r SET r.views = r.views + 1 WHERE r.id = :id")
    void incrementViews(@Param("id") Long id);
    
    // Lấy views (nếu muốn query riêng)
    @Query("SELECT r.views FROM Recipe r WHERE r.id = :id")
    Long getViews(@Param("id") Long id);


    // Chi lay scope, status, userId de check quyen
    @Query("SELECT r.scope AS scope, r.status AS status, r.user.id AS userId FROM Recipe r WHERE r.id = :recipeId")
    Optional<RecipePermissionInfoProjection> findPermissionInfoById(@Param("recipeId") Long recipeId);

    // JPQL projection cho categories - type safe, chỉ fetch fields cần
    @Query("SELECT new com.example.cooking.dto.projection.RecipeCategoryProjection(" +
            "r.id, c.id, c.name, c.slug, c.description, c.imageUrl) " +
            "FROM Recipe r JOIN r.categories c WHERE r.id IN :recipeIds")
    List<RecipeCategoryProjection> findCategoriesByRecipeIds(@Param("recipeIds") Set<Long> recipeIds);

    @Query("SELECT new com.example.cooking.dto.projection.RecipeTagProjection(" +
            "r.id, t.id, t.name, t.slug) " +
            "FROM Recipe r JOIN r.tags t WHERE r.id IN :recipeIds")
    List<RecipeTagProjection> findTagsByRecipeIds(@Param("recipeIds") Set<Long> recipeIds);

    @Query("""
                SELECT r
                FROM CollectionRecipe cr
                JOIN cr.recipe r
                WHERE cr.collection.id = :collectionId
                ORDER BY cr.order ASC, cr.addedAt ASC
            """)
    Page<Recipe> findRecipesByCollectionId(@Param("collectionId") Long collectionId, Pageable pageable);

    @Query("""
        SELECT DISTINCT r FROM Recipe r
        JOIN r.tags t
        WHERE t.id = :tagId
          AND r.scope = :scope
          AND r.status = :status
        """)
    Page<Recipe> findPublicApprovedByTagId(
            @Param("tagId") Long tagId,
            @Param("scope") Scope scope,
            @Param("status") Status status,
            Pageable pageable
    );

    @Query("""
        SELECT DISTINCT r FROM Recipe r
        JOIN r.categories c
        WHERE c.id = :categoryId
          AND r.scope = :scope
          AND r.status = :status
        """)
    Page<Recipe> findPublicApprovedByCategoryId(
            @Param("categoryId") Long tagId,
            @Param("scope") Scope scope,
            @Param("status") Status status,
            Pageable pageable
    );
    @Query("SELECT DISTINCT r FROM Recipe r " +
           "JOIN r.categories c " +
           "WHERE c.id IN :categoryIds " +
           "AND r.scope = :scope " +
           "AND r.status = :status")
    Page<Recipe> findPublicApprovedByCategoryIds(
            @Param("categoryIds") List<Long> categoryIds,
            @Param("scope") Scope scope,
            @Param("status") Status status,
            Pageable pageable);

    ////////thong ke cho admin//////////
    @Query("SELECT COUNT(r) FROM Recipe r")
    Long countAllRecipes();

    @Query("SELECT SUM(r.views) FROM Recipe r")
    Long countTotalViews();

    @Query("SELECT r.status, COUNT(r) FROM Recipe r GROUP BY r.status")
    List<Object[]> countByStatus();

    @Query("SELECT r.difficulty, COUNT(r) FROM Recipe r GROUP BY r.difficulty")
    List<Object[]> countByDifficulty();

    @Query("SELECT r.scope, COUNT(r) FROM Recipe r GROUP BY r.scope")
    List<Object[]> countByScope();

    @Query("SELECT COUNT(r) FROM Recipe r WHERE r.createdAt >= :fromDate")
    Long countCreatedSince(LocalDateTime fromDate);
    
    ///////thống kê cho chef//////////
    @Query("SELECT COUNT(r) FROM Recipe r WHERE r.user.id = :userId")
    Long countAllByUser(@Param("userId") Long userId);

    @Query("SELECT SUM(r.views) FROM Recipe r WHERE r.user.id = :userId")
    Long countTotalViewsByUser(@Param("userId") Long userId);

    @Query("SELECT r.status as status, COUNT(r) as count FROM Recipe r WHERE r.user.id = :userId GROUP BY r.status")
    List<RecipeStatusCount> countByStatusForUser(@Param("userId") Long userId);

    @Query("SELECT r.difficulty as difficulty, COUNT(r) as count FROM Recipe r WHERE r.user.id = :userId GROUP BY r.difficulty")
    List<RecipeDifficultyCount> countByDifficultyForUser(@Param("userId") Long userId);

    @Query("SELECT r.scope as scope, COUNT(r) as count FROM Recipe r WHERE r.user.id = :userId GROUP BY r.scope")
    List<RecipeScopeCount> countByScopeForUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(r) FROM Recipe r WHERE r.user.id = :userId AND r.createdAt >= :fromDate")
    Long countCreatedSinceForUser(@Param("userId") Long userId, @Param("fromDate") LocalDateTime fromDate);

    @Query("SELECT COUNT(rl) FROM RecipeLike rl WHERE rl.recipe.user.id = :userId")
    Long countTotalLikesByUser(@Param("userId") Long userId);

    //////03_12////
        // Lấy danh sách Recipe theo ingredient id
    @Query("SELECT DISTINCT r FROM Recipe r " +
           "JOIN r.recipeIngredients ri " +
           "JOIN ri.ingredient i " +
           "WHERE i.id = :ingredientId " +
           "AND r.scope = :scope " +
           "AND r.status = :status")
    Page<Recipe> findRecipesByIngredientIdAndScopeAndStatus(
            @Param("ingredientId") Long ingredientId,
            @Param("scope") Scope scope,
            @Param("status") Status status,
            Pageable pageable
    );

    //tim kiem theo nguyen lieu
        @Query(value = """
        WITH input AS (
                SELECT ingredient_id
                FROM ingredients
                WHERE ingredient_id IN (:ingredientIds)
        ),
        recipe_match AS (
                SELECT 
                r.recipe_id,
                r.title,
                r.description,
                r.image_url,
                r.prep_time,
                r.cook_time,
                r.difficulty,
                r.servings,
                r.scope,
                r.status,
                r.views,
                r.created_at,
                r.updated_at,
                ri.ingredient_id,
                i.name,
                CASE WHEN inp.ingredient_id IS NOT NULL THEN 1 ELSE 0 END AS isMatch
                FROM recipes r
                JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
                JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
                LEFT JOIN input inp ON ri.ingredient_id = inp.ingredient_id
                WHERE r.status = :status  
                AND r.scope  = :scope  
        )
        SELECT
                rm.recipe_id,
                rm.title,
                rm.description,
                rm.image_url,
                rm.prep_time,
                rm.cook_time,
                rm.difficulty,
                rm.servings,
                rm.scope,
                rm.status,
                rm.views,
                rm.created_at,
                rm.updated_at,
                GROUP_CONCAT(DISTINCT name) AS allIngredients,
                GROUP_CONCAT(DISTINCT CASE WHEN isMatch = 1 THEN name END) AS matchedIngredients,
                (
                SELECT GROUP_CONCAT(i.name)
                FROM ingredients i
                JOIN input inp ON i.ingredient_id = inp.ingredient_id
                WHERE inp.ingredient_id NOT IN (
                        SELECT ingredient_id 
                        FROM recipe_match rm2 
                        WHERE rm2.recipe_id = rm.recipe_id 
                        AND rm2.isMatch = 1
                )
                ) AS missingFromInput,
                GROUP_CONCAT(DISTINCT CASE WHEN isMatch = 0 THEN name END) AS missingFromRecipe,
                SUM(isMatch) AS matchedCount,
                COUNT(*) AS totalRecipeIngredients
        FROM recipe_match rm
        GROUP BY rm.recipe_id, rm.title
        HAVING matchedCount > 0
        ORDER BY matchedCount DESC
        """,
        // countQuery = """
        // SELECT COUNT(DISTINCT rm.recipe_id)
        // FROM recipe_match rm
        // """,
        countQuery = """
        WITH input AS (
                SELECT ingredient_id
                FROM ingredients
                WHERE ingredient_id IN (:ingredientIds)
        ),
        recipe_match AS (
                SELECT 
                        r.recipe_id,
                        ri.ingredient_id,
                        CASE WHEN inp.ingredient_id IS NOT NULL THEN 1 ELSE 0 END AS isMatch
                FROM recipes r
                JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
                LEFT JOIN input inp ON ri.ingredient_id = inp.ingredient_id
                WHERE r.status = :status  
                AND r.scope  = :scope
        )
        SELECT COUNT(DISTINCT recipe_id)
        FROM recipe_match
        WHERE isMatch = 1
        """,
        nativeQuery = true)
        Page<RecipeIngredientSearchProjection> findRecipesByIngredientIds(
                @Param("ingredientIds") List<Long> ingredientIds,
                @Param("scope") String scope,
                @Param("status") String status,
                Pageable pageable
        );


        @Query("SELECT r FROM Recipe r " +
           "JOIN r.user u " +
           "JOIN u.followers f " +
           "WHERE f.follower.id = :currentUserId " +
           "AND r.status = 'APPROVED' " + // Giả sử bạn chỉ muốn hiện công thức đã xuất bản
           "AND r.scope = 'PUBLIC' " +
           "ORDER BY r.createdAt DESC")
    Page<Recipe> findRecipesByFollowedUsers(@Param("currentUserId") Long currentUserId, Pageable pageable);

    // Lấy các recipe trong khoảng thời gian, sắp xếp theo views giảm dần
//   r.createdAt hoặc r.updatedAt
    Page<Recipe> findByCreatedAtBetweenAndStatusAndScopeOrderByViewsDesc(
            LocalDateTime start, 
            LocalDateTime end, 
            Status status,
            Scope scope,
            Pageable pageable
    );
///////////////////////////////
    @Query("SELECT r FROM Recipe r " +
           "JOIN RecipeLike rl ON rl.recipe.id = r.id " +
           "WHERE rl.createdAt BETWEEN :start AND :end " +
           "AND r.status = :status " +
           "AND r.scope = :scope " +
           "GROUP BY r.id " +
           "ORDER BY COUNT(rl.id) DESC")
    Page<Recipe> findTopLikedRecipesBetween(
            @Param("start") LocalDateTime start, 
            @Param("end") LocalDateTime end, 
            @Param("scope") Scope scope,     
            @Param("status") Status status,     
            Pageable pageable);
}
