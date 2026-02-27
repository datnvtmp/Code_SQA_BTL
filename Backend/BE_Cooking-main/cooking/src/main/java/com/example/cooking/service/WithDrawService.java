package com.example.cooking.service;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.example.cooking.common.enums.WithDrawStatus;
import com.example.cooking.dto.paymentDTO.WithdrawRequestDTO;
import com.example.cooking.dto.paymentDTO.WithdrawResponseDTO;
import com.example.cooking.security.MyUserDetails;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WithDrawService {
    private final SellerWalletService sellerWalletService;
    public WithdrawResponseDTO withdraw (MyUserDetails userDetails,WithdrawRequestDTO request){
        sellerWalletService.deductAvailable(userDetails.getId(), request.getAmount());
        String last4Digits = request.getBankInfo().getCardNumber().substring(request.getBankInfo().getCardNumber().length() - 4);
        WithdrawResponseDTO responseDTO = new WithdrawResponseDTO(WithDrawStatus.COMPLETE, userDetails.getId(), request.getAmount(), "VND", request.getBankInfo().getBankCode(), last4Digits, LocalDateTime.now(), null);
        return responseDTO;
    }
}
