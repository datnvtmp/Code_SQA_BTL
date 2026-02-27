package com.example.cooking.dto.request;

import lombok.Data;

@Data
public class AddCartItemRequest {
    private Long dishId;
    private Integer quantity;
}
