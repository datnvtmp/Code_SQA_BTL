package com.example.cooking.service.admin;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.cooking.common.PageDTO;
import com.example.cooking.common.enums.Scope;
import com.example.cooking.common.enums.Status;
import com.example.cooking.dto.mapper.RecipeMapper;
import com.example.cooking.dto.response.RecipeSummaryDTO;
import com.example.cooking.model.Recipe;
import com.example.cooking.repository.RecipeRepository;
import com.example.cooking.service.RecipeEnrichmentService;
import com.example.cooking.specifications.RecipeSpecs;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AdminRecipeService {
    private final RecipeRepository recipeRepository;
    private final RecipeMapper recipeMapper;
    private final RecipeEnrichmentService recipeEnrichmentService;
        ///////////////////
    /// TODO: UTest hàm này và hàm con
    public PageDTO<RecipeSummaryDTO> getAllRecipesForAdmin(
            Long adminId,
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
        dtos = recipeEnrichmentService.enrichAllForRecipeSummaryDTOs(dtos, adminId);

        return new PageDTO<>(page, dtos);
    }
}
