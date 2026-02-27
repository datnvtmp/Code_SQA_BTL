package com.example.cooking.dto.mapper;

import org.mapstruct.Mapper;

import com.example.cooking.dto.RoleDTO;
import com.example.cooking.model.RoleEntity;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    RoleDTO toDto(RoleEntity roleEntity);
    
}