package com.example.cooking.repository;

import com.example.cooking.model.Order;
import com.example.cooking.model.User;
import com.example.cooking.common.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByBuyer(User buyer);

    List<Order> findBySeller(User seller);

    List<Order> findByOrderStatus(OrderStatus status);
    
}
