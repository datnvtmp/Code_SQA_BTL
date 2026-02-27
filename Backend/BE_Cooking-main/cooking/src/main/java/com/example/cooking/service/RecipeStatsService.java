package com.example.cooking.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.cooking.common.enums.Difficulty;
import com.example.cooking.common.enums.Scope;
import com.example.cooking.common.enums.Status;
import com.example.cooking.dto.DailyTotalLikeStat;
import com.example.cooking.dto.DailyTotalViewStat;
import com.example.cooking.dto.RecipeDifficultyCountDTO;
import com.example.cooking.dto.RecipeScopeCountDTO;
import com.example.cooking.dto.RecipeStatusCountDTO;
import com.example.cooking.dto.projection.RecipeDailyStat;
import com.example.cooking.dto.response.RecipeLikeStatsResponse;
import com.example.cooking.dto.response.RecipeStatisticsDTO;
import com.example.cooking.dto.response.RecipeViewStatsResponse;
import com.example.cooking.exception.CustomException;
import com.example.cooking.model.Recipe;
import com.example.cooking.repository.LikeRepository;
import com.example.cooking.repository.RecipeDailyViewRepository;
import com.example.cooking.repository.RecipeRepository;
import com.example.cooking.security.MyUserDetails;
import com.example.cooking.util.DateRangeUtil;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecipeStatsService {

        private final RecipeDailyViewRepository dailyViewRepository;
        private final RecipeRepository recipeRepositoty;
        private final RecipeRepository recipeRepository;
        private final LikeRepository likeRepository;
        private final DateRangeUtil dateRangeUtil;

        ///////// thống kê cho chef///////////
        public RecipeStatisticsDTO getStatisticsForUser(Long userId) {

                // tổng số
                Long totalRecipes = recipeRepository.countAllByUser(userId);
                Long totalViews = recipeRepository.countTotalViewsByUser(userId);
                Long totalLikes = recipeRepository.countTotalLikesByUser(userId);

                // Status
                Map<Status, Long> statusMap = Arrays.stream(Status.values())
                                .collect(Collectors.toMap(
                                                status -> status,
                                                status -> 0L));
                recipeRepository.countByStatusForUser(userId).forEach(r -> statusMap.put(r.getStatus(), r.getCount()));
                List<RecipeStatusCountDTO> statusList = statusMap.entrySet().stream()
                                .map(e -> new RecipeStatusCountDTO(e.getKey(), e.getValue()))
                                .toList();

                // Difficulty
                Map<Difficulty, Long> difficultyMap = Arrays.stream(Difficulty.values())
                                .collect(Collectors.toMap(d -> d, d -> 0L));
                recipeRepository.countByDifficultyForUser(userId)
                                .forEach(r -> difficultyMap.put(r.getDifficulty(), r.getCount()));
                List<RecipeDifficultyCountDTO> difficultyList = difficultyMap.entrySet().stream()
                                .map(e -> new RecipeDifficultyCountDTO(e.getKey(), e.getValue()))
                                .toList();

                // Scope
                Map<Scope, Long> scopeMap = Arrays.stream(Scope.values())
                                .collect(Collectors.toMap(s -> s, s -> 0L));
                recipeRepository.countByScopeForUser(userId).forEach(r -> scopeMap.put(r.getScope(), r.getCount()));
                List<RecipeScopeCountDTO> scopeList = scopeMap.entrySet().stream()
                                .map(e -> new RecipeScopeCountDTO(e.getKey(), e.getValue()))
                                .toList();

                return new RecipeStatisticsDTO(
                                totalRecipes,
                                totalViews != null ? totalViews : 0L,
                                totalLikes != null ? totalLikes : 0L,
                                statusList,
                                difficultyList,
                                scopeList);
        }

        public List<RecipeDailyStat> getAuthorViewStatsLastDays(Long authorId, Integer daysBack) {
                LocalDate toDate = LocalDate.now();
                LocalDate fromDate = (daysBack != null && daysBack > 0)
                                ? toDate.minusDays(daysBack)
                                : LocalDate.of(1970, 1, 1); // mặc định toàn bộ
                return dailyViewRepository.getAuthorDailyStats(authorId, fromDate, toDate);
        }

        public List<DailyTotalViewStat> getDailyTotalViewStats(Long authorId, Integer daysBack) {
                List<RecipeDailyStat> raw = getAuthorViewStatsLastDays(authorId, daysBack);

                Map<LocalDate, List<RecipeDailyStat>> grouped = raw.stream()
                                .collect(Collectors.groupingBy(RecipeDailyStat::getDate));

                List<DailyTotalViewStat> result = new ArrayList<>();

                for (Map.Entry<LocalDate, List<RecipeDailyStat>> entry : grouped.entrySet()) {
                        LocalDate date = entry.getKey();
                        List<RecipeDailyStat> details = entry.getValue();

                        long total = details.stream().mapToLong(RecipeDailyStat::getCount).sum();

                        result.add(new DailyTotalViewStat(date, total, details));
                }

                result.sort(Comparator.comparing(DailyTotalViewStat::getDate));

                return result;
        }

        /**
         * Lấy thống kê lượt xem theo ngày của 1 recipe trong n ngày gần nhất
         */
        public List<RecipeDailyStat> getRecipeStatsLastDays(Long recipeId, Integer daysBack) {
                LocalDate toDate = LocalDate.now();
                LocalDate fromDate = (daysBack != null && daysBack > 0)
                                ? toDate.minusDays(daysBack)
                                : LocalDate.of(1970, 1, 1);

                return dailyViewRepository.getRecipeDailyStats(recipeId, fromDate, toDate);
        }

        /**
         * Tính tổng lượt xem của recipe trong khoảng thời gian
         */
        public Long getRecipeTotalViews(Long recipeId, Integer daysBack) {
                List<RecipeDailyStat> stats = getRecipeStatsLastDays(recipeId, daysBack);
                return stats.stream()
                                .mapToLong(r -> r.getCount() != null ? r.getCount() : 0L)
                                .sum();
        }

        public RecipeViewStatsResponse getRecipeStatsResponse(Long recipeId, Integer daysBack,
                        MyUserDetails currentUser) {
                Long currentUserId = currentUser != null ? currentUser.getId() : null;
                Recipe recipe = recipeRepositoty.findById(recipeId)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy recipe với id = " + recipeId));
                if (recipe.getUser().getId() != (currentUserId)) {
                        throw new CustomException("Bạn không thể xem thống kê công thức của người khác!");
                }
                List<RecipeDailyStat> dailyStats = getRecipeStatsLastDays(recipeId, daysBack);
                Long totalViews = getRecipeTotalViews(recipeId, daysBack);

                return new RecipeViewStatsResponse(dailyStats, totalViews);
        }

        ///////// like///////////
        /// hàm tính raw
        public List<RecipeDailyStat> getAuthorLikeStatsLastDays(Long authorId, Integer daysBack) {
                var range = dateRangeUtil.getRange(daysBack);
                return likeRepository.getAuthorDailyLikeStats(authorId, range[0], range[1]);
        }

        // dùng raw nhóm lại và tính tổng, trả về
        public List<DailyTotalLikeStat> getDailyTotalLikeStats(Long authorId, Integer daysBack) {
                List<RecipeDailyStat> raw = getAuthorLikeStatsLastDays(authorId, daysBack);

                Map<LocalDate, List<RecipeDailyStat>> grouped = raw.stream()
                                .collect(Collectors.groupingBy(RecipeDailyStat::getDate));

                List<DailyTotalLikeStat> result = new ArrayList<>();

                for (var entry : grouped.entrySet()) {
                        long total = entry.getValue().stream()
                                        .mapToLong(r -> r.getCount() == null ? 0 : r.getCount())
                                        .sum();

                        result.add(new DailyTotalLikeStat(entry.getKey(), total, entry.getValue()));
                }

                result.sort(Comparator.comparing(DailyTotalLikeStat::getDate));
                return result;
        }

        public List<RecipeDailyStat> getRecipeLikeStatsLastDays(Long recipeId, Integer daysBack) {
                LocalDate today = LocalDate.now();
                LocalDateTime toDate = today.atTime(23, 59, 59);

                LocalDateTime fromDate = (daysBack != null && daysBack > 0)
                        ? today.minusDays(daysBack).atStartOfDay()
                        : LocalDate.of(1970, 1, 1).atStartOfDay();

                return likeRepository.getRecipeDailyLikeStats(recipeId, fromDate, toDate);
        }


        public RecipeLikeStatsResponse getRecipeLikesResponse(
                        Long recipeId,
                        Integer daysBack,
                        MyUserDetails currentUser) {
                Long currentUserId = currentUser != null ? currentUser.getId() : null;

                // Lấy thông tin recipe
                Recipe recipe = recipeRepository.findById(recipeId)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy recipe với id = " + recipeId));

                // Không cho xem công thức của người khác
                if (!recipe.getUser().getId().equals(currentUserId)) {
                        throw new CustomException("Bạn không thể xem thống kê like của công thức người khác!");
                }

                // Lấy thống kê theo ngày
                List<RecipeDailyStat> dailyStats = getRecipeLikeStatsLastDays(recipeId, daysBack);

                // Tổng like
                Long totalLikes = dailyStats.stream()
                                .mapToLong(s -> s.getCount() == null ? 0 : s.getCount())
                                .sum();

                return new RecipeLikeStatsResponse(dailyStats, totalLikes);
        }

}
