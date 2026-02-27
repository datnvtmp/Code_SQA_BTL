package com.example.cooking.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.cooking.model.PackageUpgrade;
@Repository
public interface PackageUpgradeRepository extends JpaRepository<PackageUpgrade, Long> {
}
