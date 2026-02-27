package com.example.cooking.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

import com.example.cooking.common.enums.OrderStatus;

@Entity
@Table(name = "orders")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "order_type", discriminatorType = DiscriminatorType.STRING)
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
// Lưu ý: @AllArgsConstructor và @Builder nên được dùng trong các lớp con cụ thể
public abstract class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long id;

    // Người Mua (Buyer) - Thông tin bắt buộc cho mọi Order
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User buyer;

    // Người Bán (Seller) - Chỉ cần cho Product/Food Order, nhưng nên đặt ở đây
    // Nếu đơn hàng UPGRADE không có seller, trường này có thể NULL.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id") // seller_id có thể là nullable
    private User seller; 

    @Column(name = "order_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    @Column(name = "total_amount", nullable = false)
    private Long totalAmount;

    @Column(name = "order_info")
    private String orderInfo;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "order_type", insertable = false, updatable = false)
    private String orderType;
    
    //---------------------------------------------------------
    // Lifecycle Callbacks
    //---------------------------------------------------------
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.orderStatus == null) {
            this.orderStatus = OrderStatus.UNKOWN;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}