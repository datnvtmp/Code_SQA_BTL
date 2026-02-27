package com.example.cooking.dto.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.cooking.dto.RecipeIngredientDTO;
import com.example.cooking.dto.request.RecipeIngredientRequestDTO;
import com.example.cooking.model.RecipeIngredient;

@Mapper(componentModel = "spring")
public interface RecipeIngredientMapper {

    // @Mapping(target = "id", ignore = true)
    // @Mapping(target = "recipe", ignore = true)
    // RecipeIngredient toEntity(RecipeIngredientDTO dto);

    // List<RecipeIngredient> toEntityList(List<RecipeIngredientDTO> dtos);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "recipe", ignore = true)
    @Mapping(target = "ingredient", ignore = true)
    RecipeIngredient toEntity(RecipeIngredientRequestDTO dto);

    RecipeIngredientDTO toDto(RecipeIngredient entity);
}
