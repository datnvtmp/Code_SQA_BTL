package com.example.cooking.repository;
import com.example.cooking.dto.projection.RecipeDailyStat;
import com.example.cooking.model.RecipeDailyView;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecipeDailyViewRepository extends JpaRepository<RecipeDailyView, Long> {

    /**
     * Tìm bản ghi theo recipe và ngày
     */
    Optional<RecipeDailyView> findByRecipeIdAndViewDate(Long recipeId, LocalDate viewDate);


        /**
     * Thống kê lượt xem của các recipe của author trong khoảng thời gian
     * (dùng để lấy dữ liệu cho chart)
     */
       @Query("SELECT r.viewDate AS date, SUM(r.viewCount) AS count, r.recipe.id AS recipeId " +
              "FROM RecipeDailyView r " +
              "WHERE r.recipe.user.id = :authorId " +
              "AND r.viewDate >= :fromDate AND r.viewDate <= :toDate " +
              "GROUP BY r.recipe.id, r.viewDate " +   // GROUP BY recipe + ngày
              "ORDER BY r.viewDate, r.recipe.id")
       List<RecipeDailyStat> getAuthorDailyStats(
              @Param("authorId") Long authorId,
              @Param("fromDate") LocalDate fromDate,
              @Param("toDate") LocalDate toDate
       );

    @Query("SELECT r.viewDate AS date, SUM(r.viewCount) AS count, r.recipe.id AS recipeId " +
           "FROM RecipeDailyView r " +
           "WHERE r.recipe.id = :recipeId " +
           "AND r.viewDate >= :fromDate AND r.viewDate <= :toDate " +
           "GROUP BY r.viewDate, r.recipe.id " +
           "ORDER BY r.viewDate DESC")
    List<RecipeDailyStat> getRecipeDailyStats(
            @Param("recipeId") Long recipeId,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );


    /**
     * Thống kê lượt xem tất cả recipe theo ngày
     */
    @Query("SELECT r.viewDate AS date, SUM(r.viewCount) AS count " +
           "FROM RecipeDailyView r " +
           "GROUP BY r.viewDate ORDER BY r.viewDate")
    List<RecipeDailyStat> getAllRecipesDailyStats();
}

