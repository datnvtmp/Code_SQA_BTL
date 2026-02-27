package com.example.cooking.dto.request;

import org.springframework.web.multipart.MultipartFile;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DishCreateDTO {

    @NotBlank(message = "Dish name is required")
    @Size(max = 255, message = "Dish name must not exceed 255 characters")
    private String name;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than 0")
    private Long price;

    @NotNull
    @Min(0)
    private Long remainingServings;

    // Optional: dish có thể không thuộc recipe
    private Long recipeId;

    private MultipartFile image;
}
