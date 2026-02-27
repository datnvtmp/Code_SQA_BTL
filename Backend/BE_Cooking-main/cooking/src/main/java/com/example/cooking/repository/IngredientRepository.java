package com.example.cooking.repository;

import com.example.cooking.dto.IngredientDTO;
import com.example.cooking.dto.projection.IngredientTopUsageProjection;
import com.example.cooking.model.Ingredient;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

    // Tìm theo tên nguyên bản
    Optional<Ingredient> findByName(String name);

    // Tìm theo tên đã chuẩn hóa
    Optional<Ingredient> findByNormalizedName(String normalizedName);

    // Kiểm tra xem tên đã tồn tại chưa
    boolean existsByName(String name);

    boolean existsByNormalizedName(String normalizedName);

    // Lấy top 10 kết quả dựa trên tên (ignore case)
    @Query("SELECT new com.example.cooking.dto.IngredientDTO(i.id, i.name) " +
           "FROM Ingredient i " +
           "WHERE LOWER(i.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<IngredientDTO> findByNameContainingIgnoreCase(@Param("keyword") String keyword, Pageable pageable);

    @Query("""
        SELECT i.id AS id, 
               i.name AS name, 
               COUNT(DISTINCT ri.recipe.id) AS recipeCount
        FROM Ingredient i
        JOIN i.recipeIngredients ri
        GROUP BY i.id, i.name
        ORDER BY recipeCount DESC
        """)
    Page<IngredientTopUsageProjection> findTopIngredientsByRecipeCount(Pageable pageable);
}
