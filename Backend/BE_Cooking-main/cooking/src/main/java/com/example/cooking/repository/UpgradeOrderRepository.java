package com.example.cooking.repository;

import com.example.cooking.model.UpgradeOrder;
import com.example.cooking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UpgradeOrderRepository extends JpaRepository<UpgradeOrder, Long> {

    List<UpgradeOrder> findByBuyer(User buyer);

    List<UpgradeOrder> findByPackageUpgradeId(Long packageUpgradeId);
}
