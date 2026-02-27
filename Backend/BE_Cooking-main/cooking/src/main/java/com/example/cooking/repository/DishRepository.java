package com.example.cooking.repository;


import com.example.cooking.model.Dish;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DishRepository extends JpaRepository<Dish, Long> {

    Page<Dish> findByRecipeId(Long recipeId, Pageable pageable);

    Page<Dish> findByRecipeUserId(Long userId, Pageable pageable);

    Page<Dish> findBySellUserId(Long sellUserId, Pageable pageable);
}

