package com.example.cooking.dto;


import com.example.cooking.common.enums.DishStatus;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DishDTO {
    private Long id;
    private String name;
    private String description;
    private Long price;
    private Long recipeId;
    private String imageUrl;
    private Long remainingServings;
    private DishStatus status;
}
