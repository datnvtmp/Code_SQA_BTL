package com.example.cooking.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.cooking.common.enums.TransactionStatus;
import com.example.cooking.common.enums.TransactionType;
import com.example.cooking.dto.SellerWalletDTO;
import com.example.cooking.dto.WalletTransactionDTO;
import com.example.cooking.exception.CustomException;
import com.example.cooking.model.*;
import com.example.cooking.repository.SellerWalletRepository;
import com.example.cooking.repository.WalletTransactionRepository;
import com.example.cooking.security.MyUserDetails;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class SellerWalletService {

    private final SellerWalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;

    // Tỉ lệ hoa hồng cố định 10%
    private static final double COMMISSION_RATE = 0.10; 

    /**
     * Khởi tạo ví mới cho người bán
     */
    public SellerWallet createWallet(User seller) {
        SellerWallet wallet = new SellerWallet();
        wallet.setSeller(seller);
        wallet.setAvailableBalance(0L);
        wallet.setPendingBalance(0L);
        return walletRepository.save(wallet);
    }

    /**
     * Nghiệp vụ: Nhận tiền đơn hàng và KHẤU TRỪ HOA HỒNG.
     * Tiền cộng vào Pending là Net Amount (Tổng - Phí).
     */
    public void addOrderRevenue(Long sellerId, Long totalOrderAmount, Long orderId) {
        validateAmount(totalOrderAmount);

        // 1. Tính hoa hồng và thực nhận
        long commission = Math.round(totalOrderAmount * COMMISSION_RATE);
        long netAmount = totalOrderAmount - commission;

        // 2. Cập nhật ví
        SellerWallet wallet = getWalletOrThrow(sellerId);
        wallet.setPendingBalance(wallet.getPendingBalance() + netAmount);
        walletRepository.save(wallet);

        // 3. Ghi lịch sử giao dịch
        saveTransaction(wallet, netAmount, totalOrderAmount, commission, 
                        orderId, TransactionType.ORDER_REVENUE, TransactionStatus.COMPLETE, 
                        "Nhận tiền đơn hàng #" + orderId + " (Phí sàn " + (int)(COMMISSION_RATE*100) + "%)");

        log.info("Revenue Added - Seller: {}, Net: {}, Fee: {}", sellerId, netAmount, commission);
    }

    /**
     * Chuyển tiền từ CHỜ sang KHẢ DỤNG (Sau khi đối soát/giao hàng thành công)
     */
    public void releasePending(Long sellerId, Long amountToRelease, Long orderId) {
        validateAmount(amountToRelease);
        SellerWallet wallet = getWalletOrThrow(sellerId);

        if (wallet.getPendingBalance() < amountToRelease) {
            throw new CustomException("Số dư tạm giữ không đủ để giải ngân");
        }

        wallet.setPendingBalance(wallet.getPendingBalance() - amountToRelease);
        wallet.setAvailableBalance(wallet.getAvailableBalance() + amountToRelease);
        walletRepository.save(wallet);

        saveTransaction(wallet, amountToRelease, null, null, 
                        orderId, TransactionType.RELEASE_PENDING, TransactionStatus.COMPLETE, 
                        "Giải ngân tiền đơn hàng sau khi đã trừ phí #" + orderId + " vào ví chính");
    }

    /**
     * Rút tiền từ ví khả dụng
     */
    public void deductAvailable(Long sellerId, Long amount) {
        validateAmount(amount);
        SellerWallet wallet = getWalletOrThrow(sellerId);

        if (wallet.getAvailableBalance() < amount) {
            throw new CustomException("Số dư khả dụng không đủ");
        }

        wallet.setAvailableBalance(wallet.getAvailableBalance() - amount);
        walletRepository.save(wallet);

        saveTransaction(wallet, -amount, null, null, 
                        null, TransactionType.WITHDRAW,TransactionStatus.COMPLETE,  "Rút tiền từ ví");
    }

    /**
     * Hoàn tiền (Refund) cho người bán
     */
    public void refundToAvailable(Long sellerId, Long amount, String reason) {
        validateAmount(amount);
        SellerWallet wallet = getWalletOrThrow(sellerId);
        
        wallet.setAvailableBalance(wallet.getAvailableBalance() + amount);
        walletRepository.save(wallet);

        saveTransaction(wallet, amount, null, null, 
                        null, TransactionType.REFUND,TransactionStatus.COMPLETE,  "Hoàn tiền: " + reason);
    }

    /* ================== HELPERS ================== */

    private void saveTransaction(SellerWallet wallet, Long amount, Long gross, Long fee, 
                                 Long orderId, TransactionType type, TransactionStatus status, String desc) {
        WalletTransaction tx = WalletTransaction.builder()
                .wallet(wallet)
                .amount(amount)
                .grossAmount(gross)
                .commission(fee)
                .orderId(orderId)
                .type(type)
                .description(desc)
                .createdAt(LocalDateTime.now())
                .status(status)
                .build();
        transactionRepository.save(tx);
    }

    private SellerWallet getWalletOrThrow(Long sellerId) {
        return walletRepository.findBySellerId(sellerId)
                .orElseThrow(() -> new CustomException("Không tìm thấy ví người bán ID: " + sellerId));
    }

    public SellerWalletDTO getMyWallet(MyUserDetails userDetails) {
        SellerWallet sellerWallet = walletRepository.findBySellerId(userDetails.getId())
                .orElseThrow(() -> new CustomException("Không tìm thấy ví người bán ID: " + userDetails.getId()));
        SellerWalletDTO sellerWalletDTO = new SellerWalletDTO();
        sellerWalletDTO.setId(sellerWallet.getId());
        sellerWalletDTO.setAvailableBalance(sellerWallet.getAvailableBalance());
        sellerWalletDTO.setPendingBalance(sellerWallet.getPendingBalance());
        return sellerWalletDTO;
    }

    private void validateAmount(Long amount) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Số tiền phải lớn hơn 0");
        }
    }

    //lấy lịch sử

public List<WalletTransactionDTO> getTransactionHistory(MyUserDetails userDetails) {
    SellerWallet wallet = getWalletOrThrow(userDetails.getId());
    return transactionRepository.findByWalletIdOrderByCreatedAtDesc(wallet.getId())
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
}

private WalletTransactionDTO convertToDTO(WalletTransaction tx) {
    return WalletTransactionDTO.builder()
            .id(tx.getId())
            .amount(tx.getAmount())
            .grossAmount(tx.getGrossAmount())
            .commission(tx.getCommission())
            .orderId(tx.getOrderId())
            .description(tx.getDescription())
            .type(tx.getType().name())
            .createdAt(tx.getCreatedAt())
            .build();
}
}