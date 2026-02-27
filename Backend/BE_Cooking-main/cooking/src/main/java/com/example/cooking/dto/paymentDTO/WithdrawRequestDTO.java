package com.example.cooking.dto.paymentDTO;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class WithdrawRequestDTO {

    @NotNull
    @Positive
    private Long amount;

    @NotNull
    private BankInfoDTO bankInfo;

    private String note;

    // Getters & Setters
    // ...
}



