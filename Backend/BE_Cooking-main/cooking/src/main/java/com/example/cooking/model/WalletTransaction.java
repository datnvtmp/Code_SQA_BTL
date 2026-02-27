package com.example.cooking.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.example.cooking.common.enums.TransactionStatus;
import com.example.cooking.common.enums.TransactionType;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id")
    private SellerWallet wallet;

    private Long amount;          // Số tiền thực tế biến động trong ví (Net)
    private Long grossAmount;     // Số tiền gốc (trước khi trừ phí)
    private Long commission;      // Phí hoa hồng đã trừ
    
    private Long orderId;       // Mã đơn hàng (nếu có)
    private String description;   // Nội dung giao dịch
    
    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    private LocalDateTime createdAt;
}