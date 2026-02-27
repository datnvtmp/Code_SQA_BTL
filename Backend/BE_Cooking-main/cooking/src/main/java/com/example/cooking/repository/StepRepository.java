package com.example.cooking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cooking.model.Step;
import com.example.cooking.model.Recipe;

public interface StepRepository extends JpaRepository<Step, Long> {
    List<Step> findByRecipe_Id(Long recipeId); //map theo field id trong entity

    List<Step> findByRecipe(Recipe recipe);

}
