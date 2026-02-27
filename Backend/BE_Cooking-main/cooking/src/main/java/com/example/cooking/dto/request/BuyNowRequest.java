package com.example.cooking.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// src/main/java/com/example/cooking/dto/request/BuyNowRequest.java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuyNowRequest {
    private Long dishId;
    private Integer quantity;           // số lượng món muốn mua
    private Long addressId; 
    private String shippingNote;
    private String language;            // "vn" hoặc "en" cho VNPay
    private String bankCode;            // optional: VNPAYQR, NCB, ...
}
