package com.example.cooking.dto.paymentDTO;

import com.example.cooking.model.Order;
import com.example.cooking.model.PackageUpgrade;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// Request DTO để tạo payment
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private Order order; // "UPGRADE_CHEF"
    private Long amount;      // Số tiền (VND)
    private String bankCode;  // Optional: VNBANK, INTCARD, VNPAYQR
    private String language;  // "vn" hoặc "en"
}