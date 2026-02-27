package com.example.cooking.dto.paymentDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
// DTO cho Return URL
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentReturnResponse {
    private boolean success;
    private String message;
    private String txnRef;
    private Long amount;
    private String orderInfo;
    private String responseCode;
    private String transactionNo;
}