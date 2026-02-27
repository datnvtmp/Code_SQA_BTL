package com.example.cooking.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.cooking.model.Recipe;
import com.example.cooking.model.RecipeSearchIndex;

public interface RecipeSearchIndexRepository extends JpaRepository<RecipeSearchIndex, Long> {
    // nature mode
    // @Query(value = """
    // SELECT r.* FROM recipes r
    // JOIN recipe_search_index idx ON r.recipe_id = idx.recipe_id
    // WHERE MATCH(idx.search_text) AGAINST(:keyword IN NATURAL LANGUAGE MODE)
    // """, countQuery = """
    // SELECT COUNT(*) FROM recipes r
    // JOIN recipe_search_index idx ON r.recipe_id = idx.recipe_id
    // WHERE MATCH(idx.search_text) AGAINST(:keyword IN NATURAL LANGUAGE MODE)
    // """, nativeQuery = true)
    // Page<Recipe> searchRecipesByKeyWordPage(@Param("keyword") String keyword,
    // Pageable pageable);
    // Boolean mode
    @Query(value = """
                SELECT r.* FROM recipes r
                JOIN recipe_search_index idx ON r.recipe_id = idx.recipe_id
                WHERE MATCH(idx.search_text) AGAINST(:keyword IN BOOLEAN MODE)
            """, countQuery = """
                SELECT COUNT(*) FROM recipes r
                JOIN recipe_search_index idx ON r.recipe_id = idx.recipe_id
                WHERE MATCH(idx.search_text) AGAINST(:keyword IN BOOLEAN MODE)
            """, nativeQuery = true)
    Page<Recipe> searchRecipesByKeyWordPage(@Param("keyword") String keyword, Pageable pageable);

    @Modifying
    @Query("delete from RecipeSearchIndex r where r.recipe.id = :recipeId")
    void deleteByRecipeId(Long recipeId);

    ///////////////////////////
    @Query(value = """
            SELECT r.* FROM recipes r
            JOIN recipe_search_index idx ON r.recipe_id = idx.recipe_id
            WHERE (MATCH(idx.search_text) AGAINST(:booleanKeyword IN BOOLEAN MODE))
               OR (idx.search_text LIKE %:rawKeyword%)
            ORDER BY (MATCH(idx.search_text) AGAINST(:booleanKeyword IN BOOLEAN MODE)) DESC
            """, countQuery = """
            SELECT COUNT(*) FROM recipes r
            JOIN recipe_search_index idx ON r.recipe_id = idx.recipe_id
            WHERE (MATCH(idx.search_text) AGAINST(:booleanKeyword IN BOOLEAN MODE))
               OR (idx.search_text LIKE %:rawKeyword%)
            """, nativeQuery = true)
    Page<Recipe> searchHybrid(@Param("booleanKeyword") String booleanKeyword,
            @Param("rawKeyword") String rawKeyword,
            Pageable pageable);

    ////////////////////
    @Query(value = """
            SELECT r.*,
                ( (CASE WHEN r.title LIKE %:rawKeyword% THEN 10 ELSE 0 END) +
                  (MATCH(idx.search_text) AGAINST(:booleanKeyword IN BOOLEAN MODE)) ) as relevance
            FROM recipes r
            JOIN recipe_search_index idx ON r.recipe_id = idx.recipe_id
            WHERE
                r.title LIKE %:rawKeyword%
                OR MATCH(idx.search_text) AGAINST(:booleanKeyword IN BOOLEAN MODE)
                OR idx.search_text LIKE %:rawKeyword%
            ORDER BY relevance DESC
            """, countQuery = """
            SELECT COUNT(*) FROM recipes r
            JOIN recipe_search_index idx ON r.recipe_id = idx.recipe_id
            WHERE
                r.title LIKE %:rawKeyword%
                OR MATCH(idx.search_text) AGAINST(:booleanKeyword IN BOOLEAN MODE)
                OR idx.search_text LIKE %:rawKeyword%
            """, nativeQuery = true)
    Page<Recipe> searchHybridPriority(@Param("booleanKeyword") String booleanKeyword,
            @Param("rawKeyword") String rawKeyword,
            Pageable pageable);

    @Query(value = """
            SELECT r.*,
                ( (CASE WHEN r.title LIKE %:rawKeyword% THEN 50 ELSE 0 END) +
                  (CASE WHEN r.title LIKE %:firstWord% THEN 10 ELSE 0 END) +
                  (CASE WHEN idx.search_text LIKE %:rawKeyword% THEN 20 ELSE 0 END)
                ) as relevance
            FROM recipes r
            JOIN recipe_search_index idx ON r.recipe_id = idx.recipe_id
            WHERE r.title LIKE %:rawKeyword%
               OR idx.search_text LIKE %:rawKeyword%
               OR (idx.search_text LIKE %:firstWord% AND idx.search_text LIKE %:secondWord%)
            ORDER BY relevance DESC
            """, countQuery = """
            SELECT COUNT(*) FROM recipes r
            JOIN recipe_search_index idx ON r.recipe_id = idx.recipe_id
            WHERE r.title LIKE %:rawKeyword%
               OR idx.search_text LIKE %:rawKeyword%
               OR (idx.search_text LIKE %:firstWord% AND idx.search_text LIKE %:secondWord%)
            """, nativeQuery = true)
    Page<Recipe> searchFlexible(@Param("rawKeyword") String rawKeyword,
            @Param("firstWord") String firstWord,
            @Param("secondWord") String secondWord,
            Pageable pageable);

//     @Query(value = """
//             SELECT r.*,
//                 ( (MATCH(idx.search_text) AGAINST(:keyword IN NATURAL LANGUAGE MODE)) +
//                   (CASE WHEN r.title LIKE %:keyword% THEN 10 ELSE 0 END) ) as relevance
//             FROM recipes r
//             JOIN recipe_search_index idx ON r.recipe_id = idx.recipe_id
//             WHERE MATCH(idx.search_text) AGAINST(:keyword IN NATURAL LANGUAGE MODE)
//                OR r.title LIKE %:keyword%
//             ORDER BY relevance DESC
//             """, countQuery = """
//             SELECT COUNT(*) FROM recipes r
//             JOIN recipe_search_index idx ON r.recipe_id = idx.recipe_id
//             WHERE MATCH(idx.search_text) AGAINST(:keyword IN NATURAL LANGUAGE MODE)
//                OR r.title LIKE %:keyword%
//             """, nativeQuery = true)
//     Page<Recipe> searchNaturalLanguage(@Param("keyword") String keyword, Pageable pageable);

@Query(value = """
            SELECT r.*, 
                ( (MATCH(idx.search_text) AGAINST(:keyword IN NATURAL LANGUAGE MODE)) + 
                  (CASE WHEN r.title LIKE %:keyword% THEN 10 ELSE 0 END) ) as relevance
            FROM recipes r
            JOIN recipe_search_index idx ON r.recipe_id = idx.recipe_id
            WHERE r.scope = 'PUBLIC' 
              AND r.status = 'APPROVED'
              AND (MATCH(idx.search_text) AGAINST(:keyword IN NATURAL LANGUAGE MODE) 
                   OR r.title LIKE %:keyword%)
            ORDER BY relevance DESC
            """, countQuery = """
            SELECT COUNT(*) FROM recipes r
            JOIN recipe_search_index idx ON r.recipe_id = idx.recipe_id
            WHERE r.scope = 'PUBLIC' 
              AND r.status = 'APPROVED'
              AND (MATCH(idx.search_text) AGAINST(:keyword IN NATURAL LANGUAGE MODE) 
                   OR r.title LIKE %:keyword%)
            """, nativeQuery = true)
    Page<Recipe> searchNaturalLanguage(@Param("keyword") String keyword, Pageable pageable);
}
