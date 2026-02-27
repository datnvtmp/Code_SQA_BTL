package com.example.cooking.dto.paymentDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BankInfoDTO {

    @NotBlank
    private String bankCode = "VNBANK";

    @NotBlank
    @Size(min = 13, max = 19)
    private String cardNumber="12345678912345678";

    @NotBlank
    private String cardHolderName;
}