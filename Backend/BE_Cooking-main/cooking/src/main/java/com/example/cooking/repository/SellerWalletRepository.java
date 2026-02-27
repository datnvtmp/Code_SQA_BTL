package com.example.cooking.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cooking.model.SellerWallet;

public interface SellerWalletRepository extends JpaRepository<SellerWallet, Long> {
     Optional<SellerWallet> findBySellerId(Long sellerId);
}
