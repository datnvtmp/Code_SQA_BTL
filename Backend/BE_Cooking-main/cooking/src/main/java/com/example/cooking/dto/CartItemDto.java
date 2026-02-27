package com.example.cooking.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDto {
    private Long dishId;
    private String dishName;
    private Integer quantity;
    private Long priceSnapshot;
}
