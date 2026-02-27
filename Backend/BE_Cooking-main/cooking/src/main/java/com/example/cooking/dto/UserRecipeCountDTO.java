package com.example.cooking.dto;

import lombok.Data;

@Data
public class UserRecipeCountDTO {
    private UserDTO user;
    private Long recipeCount;
}
