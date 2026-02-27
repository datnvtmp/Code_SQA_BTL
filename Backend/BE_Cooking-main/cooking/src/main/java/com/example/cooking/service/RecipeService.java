package com.example.cooking.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.example.cooking.common.PageDTO;
import com.example.cooking.common.enums.Difficulty;
import com.example.cooking.common.enums.FileType;
import com.example.cooking.common.enums.Scope;
import com.example.cooking.common.enums.Status;
import com.example.cooking.dto.mapper.RecipeMapper;
import com.example.cooking.dto.request.NewRecipeRequest;
import com.example.cooking.dto.request.RecipeIngredientRequestDTO;
import com.example.cooking.dto.request.StepRequestDTO;
import com.example.cooking.dto.request.UpdateRecipeRequest;
import com.example.cooking.dto.response.RecipeDetailResponse;
import com.example.cooking.dto.response.RecipeSummaryDTO;
import com.example.cooking.event.RecipeCreatedEvent;
import com.example.cooking.event.RecipeUpdatedEvent;
import com.example.cooking.exception.CustomException;
import com.example.cooking.model.Recipe;
import com.example.cooking.model.RecipeDailyView;
import com.example.cooking.model.RecipeView;
import com.example.cooking.model.Step;
import com.example.cooking.model.User;
import com.example.cooking.repository.CategoryRepository;
import com.example.cooking.repository.LikeRepository;
import com.example.cooking.repository.RecipeDailyViewRepository;
import com.example.cooking.repository.RecipeRepository;
import com.example.cooking.repository.RecipeSearchIndexRepository;
import com.example.cooking.repository.RecipeViewRepository;
import com.example.cooking.repository.UserRepository;
import com.example.cooking.security.MyUserDetails;
import com.example.cooking.specifications.RecipeSpecs;

import jakarta.persistence.EntityNotFoundException;

import com.example.cooking.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecipeService {
    private final RecipeRepository recipeRepository;
    private final RecipeMapper recipeMapper;
    private final UploadFileService uploadFileService;
    private final UserRepository userRepository;
    private final RecipeEnrichmentService recipeEnrichmentService;
    private final ApplicationEventPublisher eventPublisher;
    private final RecipeSearchIndexRepository recipeSearchIndexRepository;
    private final AccessService accessService;
    private final LikeRepository likeRepository;
    private final RecipeViewRepository recipeViewRepository;
    private final RecipeDailyViewRepository recipeDailyViewRepository;
    private final RecipeIngredientService recipeIngredientService;
    private final CategoryRepository categoryRepository;

    @Transactional
    public Long addNewRecipe(MyUserDetails currentUser, NewRecipeRequest newRecipeRequest) {
        User user = userRepository.getReferenceById(currentUser.getId());
        Recipe recipe = recipeMapper.toRecipe(newRecipeRequest);
        // them anh chinh
        if (!(newRecipeRequest.getImage() == null || newRecipeRequest.getImage().isEmpty())) {
            String mainImageUrl = uploadFileService.saveFile(newRecipeRequest.getImage(), FileType.RECIPE);
            recipe.setImageUrl(mainImageUrl);
        } else
            recipe.setImageUrl("/static_resource/public/upload/avatars/avatar-holder.png");

        // Update video URL
        String videoUrl = newRecipeRequest.getVideoUrl();
        if (videoUrl != null && !videoUrl.isBlank()) {
            boolean valid = uploadFileService.isValidFileUrl(videoUrl, FileType.RECIPEVIDEO);

            if (!valid) {
                throw new CustomException("Invalid or non-existing video file");
            }

            recipe.setVideoUrl(videoUrl);
        }

        // them steps
        List<StepRequestDTO> stepDTOs = newRecipeRequest.getSteps();
        for (int i = 0; i < stepDTOs.size(); i++) {
            StepRequestDTO stepRequestDTO = stepDTOs.get(i);
            // Chuyển đổi StepRequestDTO thành Step entity
            Step step = new Step();
            step.setDescription(stepRequestDTO.getDescription());
            step.setStepTime(stepRequestDTO.getStepTime());
            step.setStepNumber(i + 1); // Đặt số thứ tự bước (bắt đầu từ 1)
            step.setRecipe(recipe); // Thiết lập mối quan hệ với Recipe
            if (!(stepRequestDTO.getImages() == null || stepRequestDTO.getImages().isEmpty())) {
                for (MultipartFile imageFile : stepRequestDTO.getImages()) {
                    String imageUrl = uploadFileService.saveFile(imageFile, FileType.STEP);
                    step.getImageUrls().add(imageUrl);
                }
            }
            recipe.getSteps().add(step); // Thêm bước vào danh sách các bước của công thức
        }
        recipe.setStatus(Status.APPROVED);
        recipe.setDifficulty(Difficulty.EASY);
        recipe.setUser(user);
        // thêm nguyên liệu
        for (RecipeIngredientRequestDTO dto : newRecipeRequest.getRecipeIngredients()) {
            recipeIngredientService.createFromDTO(dto, recipe);
        }


        Recipe saved = recipeRepository.save(recipe);
        // phat event sua cong thuc
        eventPublisher.publishEvent(new RecipeCreatedEvent(saved.getId(), newRecipeRequest, saved.getImageUrl()));
        return saved.getId();
    }

    @Transactional
    public Long updateRecipe(
            Long recipeId,
            MyUserDetails currentUser,
            UpdateRecipeRequest request) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new CustomException("Recipe not found"));

        // check owner
        if (!recipe.getUser().getId().equals(currentUser.getId())) {
            throw new CustomException("No permission to update recipe");
        }

        // update basic fields
        recipe.setTitle(request.getTitle());
        recipe.setDescription(request.getDescription());
        recipe.setServings(request.getServings());
        recipe.setPrepTime(request.getPrepTime());
        recipe.setCookTime(request.getCookTime());
        recipe.setDifficulty(request.getDifficulty());
        recipe.setScope(request.getScope());

        // image
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            String imageUrl = uploadFileService.saveFile(request.getImage(), FileType.RECIPE);
            recipe.setImageUrl(imageUrl);
        }

        // video
        if (request.getVideoUrl() != null && !request.getVideoUrl().isBlank()) {
            if (!uploadFileService.isValidFileUrl(request.getVideoUrl(), FileType.RECIPEVIDEO)) {
                throw new CustomException("Invalid video file");
            }
            recipe.setVideoUrl(request.getVideoUrl());
        }

        // ===== Steps =====
        recipe.getSteps().clear();
        List<StepRequestDTO> steps = request.getSteps();
        for (int i = 0; i < steps.size(); i++) {
            StepRequestDTO dto = steps.get(i);
            Step step = new Step();
            step.setRecipe(recipe);
            step.setDescription(dto.getDescription());
            step.setStepTime(dto.getStepTime());
            step.setStepNumber(i + 1);

            if (dto.getImages() != null) {
                for (MultipartFile file : dto.getImages()) {
                    String url = uploadFileService.saveFile(file, FileType.STEP);
                    step.getImageUrls().add(url);
                }
            }
            recipe.getSteps().add(step);
        }

        // ===== Ingredients =====
        recipe.getRecipeIngredients().clear();
        for (RecipeIngredientRequestDTO dto : request.getRecipeIngredients()) {
            recipeIngredientService.createFromDTO(dto, recipe);
        }

        // ===== Categories =====
        recipe.getCategories().clear();
        if (request.getCategoryIds() != null) {
        recipe.getCategories().addAll(
        categoryRepository.findAllById(request.getCategoryIds())
        );
        }

        // ===== Tags =====
        // recipe.getTags().clear();
        // if (request.getTagIds() != null) {
        // recipe.getTags().addAll(
        // tagRepository.findAllById(request.getTagIds())
        // );
        // }

        Recipe saved = recipeRepository.save(recipe);

        eventPublisher.publishEvent(
                new RecipeUpdatedEvent(saved.getId(),request,saved.getImageUrl()));

        return saved.getId();
    }

    @Transactional
    public void deleteRecipe(Long recipeId, MyUserDetails userDetails) {
        Recipe recipe = recipeRepository.findById(recipeId)
            .orElseThrow(() -> new EntityNotFoundException("Recipe not found"));
        // check owner
        if (!recipe.getUser().getId().equals(userDetails.getId())) {
            throw new CustomException("No permission to update recipe");
        }
        recipeSearchIndexRepository.deleteByRecipeId(recipeId);
        recipeRepository.delete(recipe);
        // Step sẽ bị xóa theo nhờ cascade + orphanRemoval
    }
    

    public void setRecipeScope(MyUserDetails currentUser, Long recipeId, Scope scope) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User không hợp lệ"));

        Recipe recipe = recipeRepository.findByIdWithUser(recipeId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with id: " + recipeId));

        boolean isAdmin = user.getRoles().stream()
                .anyMatch(role -> "ROLE_ADMIN".equals(role.getName()));

        if (!isAdmin) {
            if (!user.getId().equals(recipe.getUser().getId())) {
                throw new CustomException("Bạn không có quyền chỉnh sửa công thức này");
            }
        }
        // Cập nhật
        recipe.setScope(scope);
        recipeRepository.save(recipe);
    }

    @Transactional
    public void incrementView(Recipe recipe, Long userId) {
        User currentUser = userId != null ? userRepository.getReferenceById(userId) : null;

        LocalDate today = LocalDate.now();

        // 1. Tăng tổng view trong Recipe (hiển thị nhanh)
        recipeRepository.incrementViews(recipe.getId());

        // 2. Cập nhật lượt xem theo ngày
        RecipeDailyView dailyView = recipeDailyViewRepository
                .findByRecipeIdAndViewDate(recipe.getId(), today)
                .orElse(null);

        if (dailyView == null) {
            dailyView = new RecipeDailyView();
            dailyView.setRecipe(recipe);
            dailyView.setViewDate(today);
            dailyView.setViewCount(1L);
        } else {
            dailyView.setViewCount(dailyView.getViewCount() + 1);
        }
        recipeDailyViewRepository.save(dailyView);

        // 3. Nếu có user → lưu lượt xem cuối
        if (currentUser != null) {
            RecipeView existingView = recipeViewRepository
                    .findByRecipeIdAndUserId(recipe.getId(), userId)
                    .orElse(null);

            if (existingView == null) {
                RecipeView view = new RecipeView();
                view.setRecipe(recipe);
                view.setUser(currentUser);
                view.setViewedAt(LocalDateTime.now());
                recipeViewRepository.save(view);
            } else {
                existingView.setViewedAt(LocalDateTime.now());
                recipeViewRepository.save(existingView);
            }
        }
    }

    /**
     * Lấy số lượt view hiện tại
     */
    @Transactional(readOnly = true)
    public Long getViews(Long recipeId) {
        return recipeRepository.getViews(recipeId);
    }

    /////////////// lay 1 recipe/////////////////////////
    public RecipeDetailResponse getRecipeDetailById(Long id, MyUserDetails currentUser) {
        // ok vì cần fetch all nên join
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new CustomException("Recipe not found with id: " + id));
        // 2. Kiểm tra quyền truy cập thông qua AccessService
        Long currentUserId = currentUser != null ? currentUser.getId() : null;
        accessService.checkRecipeAccess(recipe, currentUserId);

        // Tăng lượt xem
        incrementView(recipe, currentUserId);
        RecipeDetailResponse dto = recipeMapper.toRecipeResponse(recipe);
        dto = recipeEnrichmentService.enrichForDetailResponse(dto, currentUserId);
        return dto;
    }

    // Lay recipe theo tag
    public PageDTO<RecipeSummaryDTO> getRecipeByTagId(MyUserDetails currentUser, Long tagId, Pageable pageable) {
        Page<Recipe> recipePage = recipeRepository.findPublicApprovedByTagId(
                tagId,
                Scope.PUBLIC,
                Status.APPROVED,
                pageable);

        if (recipePage.isEmpty()) {
            return PageDTO.empty(pageable);
        }
        // basic infor
        List<RecipeSummaryDTO> recipeSummaries = recipeMapper.toSummaryDTOList(recipePage.getContent());
        recipeSummaries = recipeEnrichmentService.enrichAllForRecipeSummaryDTOs(recipeSummaries, currentUser.getId());
        return new PageDTO<>(recipePage, recipeSummaries);
    }

    // Lay recipe theo category
    public PageDTO<RecipeSummaryDTO> getRecipeByCategoryId(MyUserDetails currentUser, Long categoryId,
            Pageable pageable) {
        Page<Recipe> recipePage = recipeRepository.findPublicApprovedByCategoryId(
                categoryId,
                Scope.PUBLIC,
                Status.APPROVED,
                pageable);

        if (recipePage.isEmpty()) {
            return PageDTO.empty(pageable);
        }
        // basic infor
        List<RecipeSummaryDTO> recipeSummaries = recipeMapper.toSummaryDTOList(recipePage.getContent());
        recipeSummaries = recipeEnrichmentService.enrichAllForRecipeSummaryDTOs(recipeSummaries, currentUser.getId());
        return new PageDTO<>(recipePage, recipeSummaries);
    }

    /////////////////
    public PageDTO<RecipeSummaryDTO> getRecipesByIngredientId(MyUserDetails currentUser, Long ingredientId,
            Pageable pageable) {
        Page<Recipe> recipePage = recipeRepository.findRecipesByIngredientIdAndScopeAndStatus(ingredientId,
                Scope.PUBLIC, Status.APPROVED, pageable);
        if (recipePage.isEmpty()) {
            return PageDTO.empty(pageable);
        }
        // basic infor
        List<RecipeSummaryDTO> recipeSummaries = recipeMapper.toSummaryDTOList(recipePage.getContent());
        recipeSummaries = recipeEnrichmentService.enrichAllForRecipeSummaryDTOs(recipeSummaries, currentUser.getId());
        return new PageDTO<>(recipePage, recipeSummaries);
    }
    /////////////////////

    //////////
    public PageDTO<RecipeSummaryDTO> getRecipesByCategoryIds(
            MyUserDetails currentUser, List<Long> categoryIds, Pageable pageable) {

        Page<Recipe> recipePage = recipeRepository.findPublicApprovedByCategoryIds(
                categoryIds,
                Scope.PUBLIC,
                Status.APPROVED,
                pageable);

        if (recipePage.isEmpty()) {
            return PageDTO.empty(pageable);
        }

        List<RecipeSummaryDTO> recipeSummaries = recipeMapper.toSummaryDTOList(recipePage.getContent());
        recipeSummaries = recipeEnrichmentService.enrichAllForRecipeSummaryDTOs(recipeSummaries, currentUser.getId());

        return new PageDTO<>(recipePage, recipeSummaries);
    }

    //////////////////////////////////////////
    public PageDTO<RecipeSummaryDTO> getMyRecipes(MyUserDetails currentUser, Pageable pageable) {
        Page<Recipe> recipePage = recipeRepository.findByUserId(currentUser.getId(), pageable);

        if (recipePage.isEmpty()) {
            return PageDTO.empty(pageable);
        }
        // basic infor
        List<RecipeSummaryDTO> recipeSummaries = recipeMapper.toSummaryDTOList(recipePage.getContent());
        recipeSummaries = recipeEnrichmentService.enrichAllForRecipeSummaryDTOs(recipeSummaries, currentUser.getId());
        return new PageDTO<>(recipePage, recipeSummaries);
    }

    // holder //
    public PageDTO<RecipeSummaryDTO> getPlaceHolder(MyUserDetails currentUser, Pageable pageable) {

        // Query JPA thật, không điều kiện
        Page<Recipe> recipePage = recipeRepository.findAll(pageable);

        if (recipePage.isEmpty()) {
            return PageDTO.empty(pageable);
        }

        // Map sang DTO
        List<RecipeSummaryDTO> dtos = recipeMapper.toSummaryDTOList(recipePage.getContent());

        // Enrich như thật để controller hoạt động y hệt các endpoint khác
        dtos = recipeEnrichmentService.enrichAllForRecipeSummaryDTOs(dtos, currentUser.getId());

        return new PageDTO<>(recipePage, dtos);
    }


        // holder //
    public PageDTO<RecipeSummaryDTO> getMyFollingRecipes(MyUserDetails currentUser, Pageable pageable) {

        // Query JPA thật, không điều kiện
        Page<Recipe> recipePage = recipeRepository.findRecipesByFollowedUsers(currentUser.getId(), pageable);

        if (recipePage.isEmpty()) {
            return PageDTO.empty(pageable);
        }

        // Map sang DTO
        List<RecipeSummaryDTO> dtos = recipeMapper.toSummaryDTOList(recipePage.getContent());

        // Enrich như thật để controller hoạt động y hệt các endpoint khác
        dtos = recipeEnrichmentService.enrichAllForRecipeSummaryDTOs(dtos, currentUser.getId());

        return new PageDTO<>(recipePage, dtos);
    }

    public PageDTO<RecipeSummaryDTO> getTopViewRecipes(
        MyUserDetails currentUser, 
        LocalDateTime startDate, 
        LocalDateTime endDate, 
        Pageable pageable) {

    // 1. Truy vấn DB lấy top views (chỉ lấy các bài đã PUBLISHED)
    Page<Recipe> recipePage = recipeRepository.findByCreatedAtBetweenAndStatusAndScopeOrderByViewsDesc(
            startDate, 
            endDate, 
            Status.APPROVED,
            Scope.PUBLIC,
            pageable
    );

    if (recipePage.isEmpty()) {
        return PageDTO.empty(pageable);
    }

    // 2. Map sang DTO
    List<RecipeSummaryDTO> dtos = recipeMapper.toSummaryDTOList(recipePage.getContent());

    // 3. Enrich dữ liệu (like, save status, etc.)
    dtos = recipeEnrichmentService.enrichAllForRecipeSummaryDTOs(dtos, currentUser.getId());

    return new PageDTO<>(recipePage, dtos);
}
///////////////////////////////////
public PageDTO<RecipeSummaryDTO> getTopLikeRecipes(
        MyUserDetails currentUser, 
        LocalDateTime startDate, 
        LocalDateTime endDate, 
        Pageable pageable) {

    // 1. Logic mặc định 7 ngày (có thể đưa vào Controller hoặc để ở đây)
    if (endDate == null) endDate = LocalDateTime.now();
    if (startDate == null) startDate = endDate.minusDays(7);

    // 2. Truy vấn DB
    Page<Recipe> recipePage = recipeRepository.findTopLikedRecipesBetween(startDate, endDate, Scope.PUBLIC, Status.APPROVED, pageable);

    if (recipePage.isEmpty()) {
        return PageDTO.empty(pageable);
    }

    // 3. Map sang DTO
    List<RecipeSummaryDTO> dtos = recipeMapper.toSummaryDTOList(recipePage.getContent());

    // 4. Enrich dữ liệu (để hiện thị user đã like hay chưa, v.v.)
    dtos = recipeEnrichmentService.enrichAllForRecipeSummaryDTOs(dtos, currentUser.getId());

    return new PageDTO<>(recipePage, dtos);
}

    //////////////////////////////////////////
    public PageDTO<RecipeSummaryDTO> getMyLikedRecipes(MyUserDetails currentUser, Pageable pageable) {
        Page<Recipe> recipePage = likeRepository.findRecipesByUserId(currentUser.getId(), pageable);

        if (recipePage.isEmpty()) {
            return PageDTO.empty(pageable);
        }
        // basic infor
        List<RecipeSummaryDTO> recipeSummaries = recipeMapper.toSummaryDTOList(recipePage.getContent());
        recipeSummaries = recipeEnrichmentService.enrichAllForRecipeSummaryDTOs(recipeSummaries, currentUser.getId());
        return new PageDTO<>(recipePage, recipeSummaries);
    }

    public PageDTO<RecipeSummaryDTO> getLikedRecipesByUserId(MyUserDetails currentUser, Long userId,
            Pageable pageable) {
        Page<Recipe> recipePage = likeRepository.findRecipesByUserId(userId, pageable);

        if (recipePage.isEmpty()) {
            return PageDTO.empty(pageable);
        }
        // basic infor
        List<RecipeSummaryDTO> recipeSummaries = recipeMapper.toSummaryDTOList(recipePage.getContent());
        // enrich theo user hien tai
        recipeSummaries = recipeEnrichmentService.enrichAllForRecipeSummaryDTOs(recipeSummaries, currentUser.getId());
        return new PageDTO<>(recipePage, recipeSummaries);
    }

    //////////////////////////////////////////
    public PageDTO<RecipeSummaryDTO> getMyRecentlyViewedRecipes(MyUserDetails currentUser, Pageable pageable) {
        Page<Recipe> recipePage = recipeViewRepository.findRecentlyViewedRecipes(currentUser.getId(), pageable);

        if (recipePage.isEmpty()) {
            return PageDTO.empty(pageable);
        }

        List<RecipeSummaryDTO> recipeSummaries = recipeMapper.toSummaryDTOList(recipePage.getContent());
        recipeSummaries = recipeEnrichmentService.enrichAllForRecipeSummaryDTOs(recipeSummaries, currentUser.getId());

        return new PageDTO<>(recipePage, recipeSummaries);
    }

    ///////////////////////////////
    /// TODO: UTest hàm này và hàm con
    public PageDTO<RecipeSummaryDTO> getMyRecipes(
            Long currentUserId,
            Status status,
            Scope scope,
            String keyword,
            Pageable pageable) {
        return getRecipesInternal(currentUserId, status, scope, keyword, pageable);
    }

    ///////////////////////////////
    /// Lay recipe public cua user khac
    /// TODO: UTest hàm này và hàm con
    public PageDTO<RecipeSummaryDTO> getRecipesByUserId(
            Long userId,
            Status status,
            Scope scope,
            String keyword,
            Pageable pageable) {

        return getRecipesInternal(userId, status, scope, keyword, pageable);
    }

    private PageDTO<RecipeSummaryDTO> getRecipesInternal(
            Long userId,
            Status status,
            Scope scope,
            String keyword,
            Pageable pageable) {

        Specification<Recipe> spec = Specification.allOf(
                RecipeSpecs.hasUserId(userId),
                RecipeSpecs.hasStatus(status),
                RecipeSpecs.hasScope(scope),
                RecipeSpecs.titleContains(keyword),
                RecipeSpecs.isNotDeleted());

        Page<Recipe> page = recipeRepository.findAll(spec, pageable);

        if (page.isEmpty()) {
            return PageDTO.empty(pageable);
        }

        List<RecipeSummaryDTO> dtos = recipeMapper.toSummaryDTOList(page.getContent());
        dtos = recipeEnrichmentService.enrichAllForRecipeSummaryDTOs(dtos, userId);

        return new PageDTO<>(page, dtos);
    }

    ///////////////////
    /// TODO: UTest hàm này và hàm con
    public PageDTO<RecipeSummaryDTO> getAllRecipesForAdmin(
            Long currentUserId,
            Status status,
            Scope scope,
            String keyword,
            Pageable pageable) {

        Specification<Recipe> spec = Specification.allOf(
                RecipeSpecs.hasStatus(status),
                RecipeSpecs.hasScope(scope),
                RecipeSpecs.titleContains(keyword),
                RecipeSpecs.isNotDeleted());

        Page<Recipe> page = recipeRepository.findAll(spec, pageable);

        if (page.isEmpty()) {
            return PageDTO.empty(pageable);
        }

        List<RecipeSummaryDTO> dtos = recipeMapper.toSummaryDTOList(page.getContent());
        dtos = recipeEnrichmentService.enrichAllForRecipeSummaryDTOs(dtos, currentUserId);

        return new PageDTO<>(page, dtos);
    }

    ///// thống kê cho admin////////////
    /// TODO: cânn nhắc chuyển sang service riêng cho thống kê
    // public RecipeStatisticsDTO getRecipeStatistics() {
    // Long totalRecipes = recipeRepository.countAllRecipes();
    // Long totalViews = recipeRepository.countTotalViews();

    // Map<String, Long> byStatus = recipeRepository.countByStatus().stream()
    // .collect(Collectors.toMap(
    // arr -> arr[0].toString(),
    // arr -> (Long) arr[1]));

    // Map<String, Long> byDifficulty =
    // recipeRepository.countByDifficulty().stream()
    // .collect(Collectors.toMap(
    // arr -> arr[0].toString(),
    // arr -> (Long) arr[1]));

    // Map<String, Long> byScope = recipeRepository.countByScope().stream()
    // .collect(Collectors.toMap(
    // arr -> arr[0].toString(),
    // arr -> (Long) arr[1]));

    // // Long createdLast7Days =
    // recipeRepository.countCreatedSince(LocalDateTime.now().minusDays(7));

    // return new RecipeStatisticsDTO(
    // totalRecipes,
    // totalViews != null ? totalViews : 0L,
    // byStatus,
    // byDifficulty,
    // byScope);
    // }

    //////////////
    public Recipe getRecipeById(Long id) {// admin only
        // TODO: fix
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new CustomException("Khong tim thay recipe voi id: " + id));
        return recipe;
    }

    // Search tất cả nguyên liệu (dùng Specification với LIKE)
    // public Page<RecipeSummaryDTO> searchByAllIngredients(List<String>
    // ingredients, int page, int size) {
    // if (ingredients == null || ingredients.isEmpty()) {
    // return Page.empty();
    // }

    // // Chuẩn hóa về lowercase
    // List<String> normalized = ingredients.stream()
    // .map(String::toLowerCase)
    // .toList();

    // // Tạo Specification LIKE động
    // Specification<Recipe> spec =
    // RecipeSpecifications.hasAllIngredientsLike(normalized);

    // // Tạo Pageable (sắp xếp theo createdAt DESC)
    // Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC,
    // "createdAt"));

    // // Query và map sang DTO
    // Page<Recipe> recipePage = recipeRepository.findAll(spec, pageable);
    // return recipePage.map(recipeMapper::toSummaryDTO);
    // }

    public PageDTO<RecipeSummaryDTO> searchByKeyWord(String keyWord, Pageable pageable, MyUserDetails currentUser) {
    // 1. Giữ nguyên từ khóa tự nhiên (ví dụ: "gà tần")
    String cleanKeyword = keyWord.trim();

    // 2. Gọi repository với chế độ Natural Language + LIKE fallback
    Page<Recipe> recipePage = recipeSearchIndexRepository.searchNaturalLanguage(cleanKeyword, pageable);

    if (recipePage.isEmpty()) {
        return PageDTO.empty(pageable);
    }

    // 3. Mapping và Enrich dữ liệu
    List<RecipeSummaryDTO> recipeSummaryDTOs = recipeMapper.toSummaryDTOList(recipePage.getContent());
    recipeSummaryDTOs = recipeEnrichmentService.enrichAllForRecipeSummaryDTOs(
            recipeSummaryDTOs, currentUser.getId());

    return new PageDTO<>(recipePage, recipeSummaryDTOs);
}
}
