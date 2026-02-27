package com.example.cooking.repository;

import com.example.cooking.dto.DishInOrderDto;
import com.example.cooking.model.DishOrderItem;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DishOrderItemRepository extends JpaRepository<DishOrderItem, Long> {
    @Query("""
        select new com.example.cooking.dto.DishInOrderDto(
            d.id,
            d.name,
            i.priceAtOrder,
            i.quantity
        )
        from DishOrderItem i
        join i.dish d
        where i.dishOrder.id = :orderId
    """)
    List<DishInOrderDto> findDishDtosByOrderId(@Param("orderId") Long orderId);
}

