package com.example.cooking.dto;
import java.time.LocalDateTime;
import com.example.cooking.common.enums.OrderStatus;
import lombok.Data;
@Data
public class DishOrderDTO {
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
}