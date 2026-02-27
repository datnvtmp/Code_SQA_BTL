package com.example.cooking.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.cooking.common.enums.Status;
import com.example.cooking.exception.CustomException;
import com.example.cooking.model.Recipe;
import com.example.cooking.model.User;
import com.example.cooking.repository.RecipeRepository;
import com.example.cooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    // private final UserMapper userMapper;
    private final RecipeRepository recipeRepository;

    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users;
    }

    public void setRecipeStatus(Long id, Status status) {
        Recipe recipe = recipeRepository.findSimpleById(id).orElseThrow(() -> new CustomException("Recipe not found with id: " + id));
        recipe.setStatus(status);
        recipeRepository.save(recipe);
    }
}
