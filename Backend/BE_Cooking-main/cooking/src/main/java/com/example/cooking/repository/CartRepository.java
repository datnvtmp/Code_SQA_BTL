package com.example.cooking.repository;


import com.example.cooking.common.enums.CartStatus;
import com.example.cooking.model.Cart;
import com.example.cooking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    // Tìm ACTIVE cart cho 1 user + 1 seller
    Optional<Cart> findByUserAndSellUserAndStatus(User user, User sellUser, CartStatus status);
        // Lấy tất cả cart ACTIVE của user
    List<Cart> findAllByUserAndStatus(User user, CartStatus status);

    Optional<Cart> findByIdAndUserIdAndStatus(
    Long id,
    Long userId,
    CartStatus status
);

}

