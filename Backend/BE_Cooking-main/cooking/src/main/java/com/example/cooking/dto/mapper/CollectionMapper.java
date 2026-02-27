package com.example.cooking.dto.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.cooking.dto.CollectionDTO;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface CollectionMapper {

    @Mapping(target = "recipeCount", ignore = true)
    CollectionDTO toCollectionDTO(com.example.cooking.model.Collection collection);
    
    List<CollectionDTO> toListCollectionDTO(List<com.example.cooking.model.Collection> collections);


}