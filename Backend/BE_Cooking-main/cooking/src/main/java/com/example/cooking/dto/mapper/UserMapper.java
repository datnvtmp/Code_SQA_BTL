package com.example.cooking.dto.mapper;

import java.util.List;

import javax.management.relation.Role;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.cooking.config.AppProperties;
import com.example.cooking.dto.UserDTO;
import com.example.cooking.dto.request.RegisterRequest;
import com.example.cooking.model.User;

@Mapper(componentModel = "spring", uses = {RoleMapper.class})
public abstract class UserMapper {

        @Autowired
    protected AppProperties appProperties;

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "roles", ignore = true)
    // @Mapping(target = "bio", ignore = true)
    @Mapping(target = "lastLogin", ignore = true)
    @Mapping(target = "recipes", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "avatarUrl", ignore = true)
    @Mapping(target = "refreshTokens", ignore = true)
    public abstract User toUser (RegisterRequest entity);

    // // @Mapping(target = "id", ignore = true)
    // // @Mapping(target = "username", ignore = true)
    // @Mapping(target = "password", ignore = true)
    // // @Mapping(target = "createdAt", ignore = true)
    // // @Mapping(target = "dob", ignore = true)
    // // @Mapping(target = "bio", ignore = true)
    // // @Mapping(target = "lastLogin", ignore = true)
    // @Mapping(target = "recipes", ignore = true)
    // @Mapping(target = "roles", ignore = true)
    // @Mapping(target = "username", source = "myUserName")
    // @Mapping(target = "status", ignore = true)
    // public abstract User toUser (MyUserDetails entity);


    public abstract UserDTO toUserDTO (User entity);

    public abstract List<UserDTO> toUserDTOList (List<User> entities);
    
    @AfterMapping
    protected void addFullAvatarUrl(@MappingTarget UserDTO dto, User user) {
        if (user.getAvatarUrl() != null) {
            dto.setAvatarUrl(appProperties.getStaticBaseUrl() + user.getAvatarUrl());
        }
    }
}
