package com.example.cooking.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.cooking.common.enums.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
public class DishOrderDetailDTO {
    private Long id;
    private UserDTO buyer;
    private UserDTO seller; 
    private OrderStatus orderStatus;
    private Long totalAmount;
    private String orderInfo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String orderType;
    private String shippingNote;

    private AdressDTO address;
    private List<DishInOrderDto> dishInOrderDtos;
}
