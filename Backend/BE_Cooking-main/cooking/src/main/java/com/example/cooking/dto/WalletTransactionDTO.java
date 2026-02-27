package com.example.cooking.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

import com.example.cooking.common.enums.TransactionStatus;

@Data
@Builder
public class WalletTransactionDTO {
    private Long id;
    private Long amount;          // Số tiền thực nhận (Net)
    private Long grossAmount;     // Số tiền gốc
    private Long commission;      // Phí sàn
    private Long orderId;
    private String description;
    private String type;          // ORDER_REVENUE, WITHDRAW, v.v.
    private TransactionStatus status;
    private LocalDateTime createdAt;
}
