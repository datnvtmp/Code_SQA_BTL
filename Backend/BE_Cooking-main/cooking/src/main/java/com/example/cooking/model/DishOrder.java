package com.example.cooking.model;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


@Entity
@Table(name = "product_orders") // Bảng riêng cho đơn hàng sản phẩm/đồ ăn
@DiscriminatorValue("PURCHASE_PRODUCT") 
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class DishOrder extends Order { // order dành cho mua sản phẩm/đồ ăn
    
    @OneToMany(mappedBy = "dishOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DishOrderItem> items;


    //---------------------------------------------------------
    // Thông tin Shipping (Được gộp trực tiếp vào bảng product_orders)
    //---------------------------------------------------------
    
    @ManyToOne
    @JoinColumn(name="address_id", nullable = false)
    private Address address;

    @Column(name = "shipping_note")
    private String shippingNote;
}