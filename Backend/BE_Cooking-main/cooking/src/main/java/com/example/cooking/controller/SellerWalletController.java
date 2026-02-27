package com.example.cooking.controller;


import com.example.cooking.common.ApiResponse;
import com.example.cooking.dto.SellerWalletDTO;
import com.example.cooking.dto.WalletTransactionDTO;
import com.example.cooking.dto.paymentDTO.WithdrawRequestDTO;
import com.example.cooking.dto.paymentDTO.WithdrawResponseDTO;
import com.example.cooking.security.MyUserDetails;
import com.example.cooking.service.SellerWalletService;
import com.example.cooking.service.WithDrawService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller/wallet")
@RequiredArgsConstructor
public class SellerWalletController {

    private final SellerWalletService walletService;
    private final WithDrawService withDrawService;
    /**
     * Lấy thông tin số dư ví hiện tại
     * Giả sử sellerId được lấy từ Token/Session. Ở đây dùng PathVariable để dễ test.
     */
    @GetMapping("/my-waller")
    public ResponseEntity<ApiResponse<SellerWalletDTO>> getBalance(@AuthenticationPrincipal MyUserDetails userDetails) {
        // Bạn có thể tạo thêm WalletDTO nếu không muốn trả về toàn bộ Entity Wallet
        return ApiResponse.ok(walletService.getMyWallet(userDetails));
    }

    /**
     * Lấy danh sách lịch sử giao dịch (đối soát tiền hàng, phí sàn)
     */
    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<WalletTransactionDTO>>> getHistory(@AuthenticationPrincipal MyUserDetails userDetails) {
        List<WalletTransactionDTO> history = walletService.getTransactionHistory(userDetails);
        return ApiResponse.ok(history);
    }

    
    @PostMapping("/with-draw")
    public ResponseEntity<ApiResponse<WithdrawResponseDTO>> addItem(
            @AuthenticationPrincipal MyUserDetails myUserDetails,
            @Valid @RequestBody WithdrawRequestDTO request) {
        return ApiResponse.ok(withDrawService.withdraw(myUserDetails, request));
    }

    
}