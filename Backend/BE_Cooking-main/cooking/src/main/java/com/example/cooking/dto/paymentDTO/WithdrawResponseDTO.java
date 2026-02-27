package com.example.cooking.dto.paymentDTO;

import java.time.LocalDateTime;

import com.example.cooking.common.enums.WithDrawStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
public class WithdrawResponseDTO {

    private WithDrawStatus status;
    private Long sellerId;
    private Long amount;
    private String currency;
    private String bankCode;
    private String cardLast4; // bốn số cuối
    private LocalDateTime requestedAt;
    private String message; // only for error
}

