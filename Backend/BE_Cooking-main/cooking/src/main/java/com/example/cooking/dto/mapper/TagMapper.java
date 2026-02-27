package com.example.cooking.dto.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.example.cooking.dto.TagDTO;
import com.example.cooking.model.Tag;

@Mapper(componentModel = "spring")
public interface TagMapper {

    TagDTO toTagResponse(Tag tag);
    List<TagDTO> toTagResponseList(List<Tag> tags);
    
}