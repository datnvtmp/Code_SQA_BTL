package com.example.cooking.dto.mapper;

import java.util.List;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.cooking.config.AppProperties;
import com.example.cooking.dto.DishDTO;
import com.example.cooking.dto.response.RecipeDetailResponse;
import com.example.cooking.model.Dish;
import com.example.cooking.model.Recipe;

@Mapper(componentModel = "spring")
public abstract class DishMapper {
        @Autowired
    protected AppProperties appProperties;

    @Mapping(source = "recipe.id", target = "recipeId")
    public abstract DishDTO toDTO(Dish dish);

    public abstract List<DishDTO> toDTOs(List<Dish> dishes);

    @AfterMapping
    protected void addBaseUrl(@MappingTarget DishDTO response, Dish entity) {
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
