package com.example.cooking.dto;

import lombok.Data;

@Data
public class SellerWalletDTO {
    private Long id;
    private Long availableBalance;
    private Long pendingBalance;

    // getters & setters
}
