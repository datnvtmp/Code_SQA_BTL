package com.example.cooking.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cooking.model.Address;
import com.example.cooking.model.User;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
       List<Address> findByUser(User user);
}
