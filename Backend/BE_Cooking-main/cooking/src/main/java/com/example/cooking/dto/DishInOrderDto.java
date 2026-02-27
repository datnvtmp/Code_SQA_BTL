package com.example.cooking.dto;

import lombok.Data;
@Data
public class DishInOrderDto {

    private Long dishId;
    private String dishName;
    private Long priceAtOrder;
    private Integer quantity;

    public DishInOrderDto(Long dishId, String dishName, Long priceAtOrder, Integer quantity) {
        this.dishId = dishId;
        this.dishName = dishName;
        this.priceAtOrder = priceAtOrder;
        this.quantity = quantity;
    }

    // getters
}
