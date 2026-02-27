package com.example.cooking.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "order_items")
public class DishOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Long id;

    @Column(name= "quantity", nullable = false)
    private Integer quantity;

    @Column(name= "price_at_order", nullable = false)
    private Long priceAtOrder;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private DishOrder dishOrder;

    @ManyToOne
    @JoinColumn(name = "dish_id")
    private Dish dish;
}
