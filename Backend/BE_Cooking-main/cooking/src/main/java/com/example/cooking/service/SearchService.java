package com.example.cooking.service;

import com.example.cooking.common.PageDTO;
import com.example.cooking.common.enums.Scope;
import com.example.cooking.common.enums.Status;
import com.example.cooking.config.AppProperties;
import com.example.cooking.dto.RecipeIngredientSearchResponse;
import com.example.cooking.dto.mapper.RecipeMapper;
import com.example.cooking.dto.projection.RecipeIngredientSearchProjection;
import com.example.cooking.dto.response.RecipeSummaryDTO;
import com.example.cooking.model.Recipe;
import com.example.cooking.repository.RecipeRepository;
import com.example.cooking.repository.RecipeSearchIndexRepository;
import com.example.cooking.security.MyUserDetails;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final RecipeRepository recipeRepository;
    private final AppProperties appProperties;
    private final RecipeSearchIndexRepository recipeSearchIndexRepository;
    private final RecipeEnrichmentService recipeEnrichmentService;
    private final RecipeMapper recipeMapper;

    public PageDTO<RecipeIngredientSearchResponse> searchByIngredients(
            List<Long> ingredientIds, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<RecipeIngredientSearchProjection> pageResult = recipeRepository.findRecipesByIngredientIds(ingredientIds,
                Scope.PUBLIC.name(), Status.APPROVED.name(), pageable);

        if (pageResult.isEmpty()) {
            return PageDTO.empty(pageable);
        }

        String baseUrl = appProperties.getStaticBaseUrl();

        List<RecipeIngredientSearchResponse> mappedContent = pageResult.stream().map(p -> {
            RecipeIngredientSearchResponse dto = new RecipeIngredientSearchResponse();
            dto.setRecipeId(p.getRecipeId());
            dto.setTitle(p.getTitle());
            dto.setDescription(p.getDescription());
            dto.setImageUrl(
                    p.getImageUrl() != null ? baseUrl + p.getImageUrl() : null);
            dto.setPrepTime(p.getPrepTime());
            dto.setCookTime(p.getCookTime());
            dto.setDifficulty(p.getDifficulty());
            dto.setServings(p.getServings());
            dto.setScope(p.getScope());
            dto.setStatus(p.getStatus());
            dto.setViews(p.getViews());
            dto.setCreatedAt(p.getCreatedAt());
            dto.setUpdatedAt(p.getUpdatedAt());
            dto.setMatchedIngredients(p.getMatchedIngredients());
            dto.setMissingFromInput(p.getMissingFromInput());
            dto.setMissingFromRecipe(p.getMissingFromRecipe());
            dto.setMatchedCount(p.getMatchedCount());
            dto.setTotalRecipeIngredients(p.getTotalRecipeIngredients());
            dto.setAllIngredients(p.getAllIngredients());
            return dto;
        }).toList();

        return new PageDTO<>(pageResult, mappedContent);
    }

    ///////////////////////////////////////////////////////////////////////////////
    // Test///////////
    //////
    // Search by keyword

    // public PageDTO<RecipeSummaryDTO> searchByKeyWord(String keyWord, Pageable pageable, MyUserDetails currentUser) {
    //     // 1. Format keyword cho BOOLEAN MODE: mỗi từ bắt buộc có dấu +
    //     // Ví dụ: "món chiên" -> "+món +chiên"
    //     String booleanKeyword = Arrays.stream(keyWord.trim().split("\\s+"))
    //             .map(word -> "+" + word)
    //             .collect(Collectors.joining(" "));

    //     // 2. Gọi repository với BOOLEAN MODE
    //     // Page<Recipe> recipePage = recipeSearchIndexRepository.searchRecipesByKeyWordPage(booleanKeyword, pageable);
    //     // Page<Recipe> recipePage = recipeSearchIndexRepository.searchHybrid(booleanKeyword, keyWord, pageable);
    //     Page<Recipe> recipePage = recipeSearchIndexRepository.searchHybridPriority(booleanKeyword, keyWord, pageable);

    //     // 3. Nếu không có kết quả, trả về PageDTO rỗng
    //     if (recipePage.isEmpty()) {
    //         return PageDTO.empty(pageable);
    //     }

    //     // 4. Map entity sang DTO
    //     List<RecipeSummaryDTO> recipeSummaryDTOs = recipeMapper.toSummaryDTOList(recipePage.getContent());

    //     // 5. Enrich dữ liệu thêm theo user
    //     recipeSummaryDTOs = recipeEnrichmentService.enrichAllForRecipeSummaryDTOs(recipeSummaryDTOs,
    //             currentUser.getId());

    //     // 6. Trả về PageDTO với dữ liệu đã map
    //     return new PageDTO<>(recipePage, recipeSummaryDTOs);
    // }
//     public PageDTO<RecipeSummaryDTO> searchByKeyWord(String keyWord, Pageable pageable, MyUserDetails currentUser) {
//     String raw = keyWord.trim();
//     String[] words = raw.split("\\s+");
    
//     // Lấy ra 2 từ đầu tiên để tìm kiếm bổ trợ nếu người dùng gõ dài
//     String firstWord = words.length > 0 ? words[0] : raw;
//     String secondWord = words.length > 1 ? words[1] : firstWord;

//     // Gọi repository với phương thức mới
//     Page<Recipe> recipePage = recipeSearchIndexRepository.searchFlexible(
//             raw, 
//             firstWord, 
//             secondWord, 
//             pageable
//     );

//     if (recipePage.isEmpty()) {
//         return PageDTO.empty(pageable);
//     }

//     // Mapping DTO và Enrich dữ liệu (giữ nguyên)
//     List<RecipeSummaryDTO> recipeSummaryDTOs = recipeMapper.toSummaryDTOList(recipePage.getContent());
//     recipeSummaryDTOs = recipeEnrichmentService.enrichAllForRecipeSummaryDTOs(
//             recipeSummaryDTOs, currentUser.getId());

//     return new PageDTO<>(recipePage, recipeSummaryDTOs);
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
