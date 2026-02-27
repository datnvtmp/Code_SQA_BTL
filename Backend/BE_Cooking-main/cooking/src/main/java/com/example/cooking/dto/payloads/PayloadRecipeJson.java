package com.example.cooking.dto.payloads;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PayloadRecipeJson {
    private final String title;
    private final String description;
    private final String ingredients;
    private final String steps;
    private final String imageUrl;
}