package com.example.cooking.dto.request;

import lombok.Data;

@Data
public class UpdateCartItemRequest {
    private Long dishId;
    private Integer quantity;
}
