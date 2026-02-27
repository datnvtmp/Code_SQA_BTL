package com.example.cooking.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cooking.common.enums.RequestStatus;
import com.example.cooking.model.ChefRequest;

public interface ChefRequestRepository extends JpaRepository<ChefRequest, Long> {
    boolean existsByUserIdAndStatus(Long userId, RequestStatus status);
}
