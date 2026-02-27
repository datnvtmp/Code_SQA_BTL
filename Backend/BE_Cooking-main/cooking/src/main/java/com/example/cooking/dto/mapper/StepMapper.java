package com.example.cooking.dto.mapper;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.cooking.config.AppProperties;
import com.example.cooking.dto.StepDTO;
import com.example.cooking.model.Step;


@Mapper(componentModel = "spring")
public abstract class StepMapper {
    @Autowired
    protected AppProperties appProperties;


    @Mapping(target = "stepNumber", source = "stepNumber")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "imageUrls", source = "imageUrls")
    public abstract StepDTO toDTO(Step step);

    @AfterMapping
    protected void addFullImageURL(@MappingTarget StepDTO response, Step entity) { 
        if (entity.getImageUrls() != null && !entity.getImageUrls().isEmpty()) {
            for (int i = 0; i < entity.getImageUrls().size(); i++) {
                String imageUrl = entity.getImageUrls().get(i);
                // if (imageUrl != null && !imageUrl.startsWith("http")) {
                if (imageUrl != null) {
                    entity.getImageUrls().set(i, appProperties.getStaticBaseUrl()+ imageUrl); 
                }
            }
            response.setImageUrls(entity.getImageUrls());
        }
    }

    // // Map từ StepDTO sang Step (cần Recipe truyền vào)
    // @Mapping(target = "id", ignore = true)  // ID tự sinh
    // @Mapping(target = "recipe", ignore = true)
    // Step toEntity(StepResponseDTO dto);

}
