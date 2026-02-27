package com.example.cooking.dto.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.example.cooking.dto.response.ChefRequestResponseDTO;
import com.example.cooking.model.ChefRequest;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface ChefRequestMapper {
    ChefRequestResponseDTO toDto(ChefRequest chefRequest);
    List<ChefRequestResponseDTO> toDtoList(List<ChefRequest> chefRequests);
}
