package com.example.cooking.dto.mapper;

import java.util.List;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.cooking.config.AppProperties;
import com.example.cooking.dto.CategoryDTO;
import com.example.cooking.dto.request.CategoryRequestDTO;
import com.example.cooking.model.Category;

@Mapper(componentModel = "spring")
public abstract class CategoryMapper {

    @Autowired
    protected AppProperties appProperties;

    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "recipes", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    public abstract Category toEntity(CategoryRequestDTO dto);
    public abstract List<Category> toEntity(List<CategoryRequestDTO> dtos);

    public abstract CategoryDTO toDTO(Category category);
    public abstract List<CategoryDTO> toDTO(List<Category> categories);

    @AfterMapping
    protected void addFullImageUrl(@MappingTarget CategoryDTO dto, Category category) {
        if (category.getImageUrl() != null) {
            dto.setImageUrl(appProperties.getStaticBaseUrl() + category.getImageUrl());
        }
    }
}
