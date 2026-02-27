package com.example.cooking.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "upgrade_orders") // Bảng riêng cho đơn hàng nâng cấp
@DiscriminatorValue("UPGRADE_CHEF") 
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class UpgradeOrder extends Order {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_upgrade_id", nullable = false)
    private PackageUpgrade packageUpgrade;

    @Column(name = "package_duration_days", nullable = false)
    private Integer packageDurationDays;

    @Column(name = "role_assigned", nullable = false)
    private String roleAssigned;
    
    // Ghi đè phương thức Builder để thiết lập mặc định cho Seller (null) nếu cần
}