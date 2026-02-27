package com.example.cooking.repository;


import com.example.cooking.common.enums.TransactionStatus;
import com.example.cooking.common.enums.TransactionType;
import com.example.cooking.model.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {
    // Tìm lịch sử giao dịch của một ví, sắp xếp theo thời gian mới nhất
    List<WalletTransaction> findByWalletIdOrderByCreatedAtDesc(Long walletId);
    Optional<WalletTransaction> findFirstByOrderIdAndTypeAndStatus(Long orderId, TransactionType type, TransactionStatus status);


}