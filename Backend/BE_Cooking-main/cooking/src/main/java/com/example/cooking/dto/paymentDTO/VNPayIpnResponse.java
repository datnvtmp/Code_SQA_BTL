package com.example.cooking.dto.paymentDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO cho IPN callback
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VNPayIpnResponse {
    private String RspCode;
    private String Message;
}