package com.example.cooking.dto.mapper;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.cooking.config.AppProperties;
import com.example.cooking.dto.projection.RecipeIngredientSearchProjection;
import com.example.cooking.dto.request.NewRecipeRequest;
import com.example.cooking.dto.response.RecipeDetailResponse;
import com.example.cooking.dto.response.RecipeSummaryDTO;
import com.example.cooking.model.Category;
import com.example.cooking.model.Recipe;
import com.example.cooking.model.Tag;
import com.example.cooking.repository.CategoryRepository;
import com.example.cooking.repository.TagRepository;

@Mapper(componentModel = "spring", uses = {
                                            StepMapper.class, 
                                            UserMapper.class, 
                                            RecipeIngredientMapper.class,
                                            TagMapper.class,
                                            CategoryMapper.class})
public abstract class RecipeMapper {
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private TagRepository tagRepository;
    @Autowired
    protected AppProperties appProperties;



    @Mapping  (target = "id", ignore = true)
    @Mapping  (target = "createdAt", ignore = true)
    @Mapping  (target = "updatedAt", ignore = true)
    @Mapping  (target = "user", ignore = true) 
    @Mapping (target = "status", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "steps", ignore = true) // Steps sẽ được map riêng
    @Mapping(target = "recipeIngredients", ignore = true) //map riêng
    public abstract Recipe toRecipe(NewRecipeRequest entity);
    

    @Mapping (target = "likeCount", ignore = true)
    @Mapping (target = "saveCount", ignore = true)
    @Mapping (target = "commentCount", ignore = true)
    @Mapping (target = "likedByCurrentUser", ignore = true)
    @Mapping (target = "savedByCurrentUser", ignore = true)
    @Mapping (target = "ingredients", source = "recipeIngredients")
    public abstract RecipeDetailResponse toRecipeResponse(Recipe entity);

    public abstract List<RecipeDetailResponse> toRecipeResponseList(List<Recipe> entities);
// 
    @Mapping(target = "user", source = "user")
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "likeCount", ignore = true)
    @Mapping(target = "commentCount", ignore = true)
    @Mapping(target = "likedByCurrentUser", ignore = true)
    @Mapping(target = "saveCount", ignore = true)
    @Mapping(target = "savedByCurrentUser", ignore = true)
    public abstract RecipeSummaryDTO toSummaryDTO(Recipe entity);

    public abstract List<RecipeSummaryDTO> toSummaryDTOList(List<Recipe> entities);


    // @Mapping(target = "user", source = "user")
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "likeCount", ignore = true)
    @Mapping(target = "commentCount", ignore = true)
    @Mapping(target = "likedByCurrentUser", ignore = true)
    @Mapping(target = "saveCount", ignore = true)
    @Mapping(target = "savedByCurrentUser", ignore = true)
    public abstract RecipeSummaryDTO toSummaryDTO (RecipeIngredientSearchProjection entity);



    @AfterMapping
    protected void addBaseUrl(@MappingTarget RecipeDetailResponse response, Recipe entity) {
        response.setImageUrl(ensureFullUrl(entity.getImageUrl()));
        response.setVideoUrl(ensureFullUrl(entity.getVideoUrl()));
    }


        @AfterMapping
    protected void mapCategoriesAndTags(@MappingTarget Recipe recipe, NewRecipeRequest request) {
        // Map categoryIds -> Category entities
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            Set<Category> categories = new HashSet<>(categoryRepository.findAllById(request.getCategoryIds()));
            recipe.setCategories(categories);
        }

        // Map tagIds -> Tag entities
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllById(request.getTagIds()));
            recipe.setTags(tags);
        }
    }

    @AfterMapping
    protected void addFullImageURL(@MappingTarget RecipeSummaryDTO response, Recipe entity) {
        response.setImageUrl(ensureFullUrl(entity.getImageUrl()));
    }

        // --- Phương thức tiện ích kiểm tra URL ---
    private String ensureFullUrl(String url) {
        if (url == null || url.isEmpty()) return url;
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }
        return appProperties.getStaticBaseUrl() + url;
    }

}
