package com.example.cooking.repository;

import com.example.cooking.dto.projection.RecipeDailyStat;
import com.example.cooking.model.Recipe;
import com.example.cooking.model.RecipeView;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeViewRepository extends JpaRepository<RecipeView, Long> {

        boolean existsByRecipeIdAndUserId(Long recipeId, Long userId);

        Optional<RecipeView> findByRecipeIdAndUserId(Long recipeId, Long userId);

        @Query("""
                        SELECT rv.recipe
                        FROM RecipeView rv
                        WHERE rv.user.id = :userId
                        AND rv.recipe.status = com.example.cooking.common.enums.Status.APPROVED
                        AND (
                                rv.recipe.scope = com.example.cooking.common.enums.Scope.PUBLIC
                                OR (rv.recipe.scope = com.example.cooking.common.enums.Scope.PRIVATE AND rv.recipe.user.id = :userId)
                        )
                        ORDER BY rv.viewedAt DESC
                        """)
        // TODO: check lại truy vấn
        Page<Recipe> findRecentlyViewedRecipes(
                        @Param("userId") Long userId,
                        Pageable pageable);



}
