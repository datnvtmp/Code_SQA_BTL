package com.example.cooking.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "packages_upgrades")
@Data
public class PackageUpgrade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;           // Tên gói, ví dụ "VIP 1 Month"
    private String description;    // Mô tả gói
    private Long price;            // Giá tiền, đơn vị VND
    private Integer durationDays;  // Thời hạn gói tính bằng ngày
}
