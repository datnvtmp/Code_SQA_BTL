package com.example.cooking.service;


import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.cooking.event.RecipeLikedEvent;
import com.example.cooking.exception.CustomException;
import com.example.cooking.model.Recipe;
import com.example.cooking.model.RecipeLike;
import com.example.cooking.model.User;
import com.example.cooking.repository.LikeRepository;
import com.example.cooking.repository.RecipeRepository;
import com.example.cooking.repository.UserRepository;
import com.example.cooking.security.MyUserDetails;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecipeLikeService {
    private final LikeRepository likeRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final AccessService accessService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    //TODO: Bỏ check recipe vì đã check trong acess
    public void likeRecipe(MyUserDetails currentUser, Long recipeId) {
        User user = userRepository.getReferenceById(currentUser.getId());
        User userTest = userRepository.findById(currentUser.getId()).orElseThrow(()->new CustomException("Khong ton tai user"));
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new CustomException("Recipe not found"));
        accessService.checkRecipeAccess(recipeId, currentUser.getId());
        // Check nếu user đã like
        boolean alreadyLiked = likeRepository.existsByUserIdAndRecipeId(currentUser.getId(), recipeId);
        if (alreadyLiked) {
            throw new CustomException("User already liked this recipe");
        }
        RecipeLike like = new RecipeLike();
        like.setUser(user);
        like.setRecipe(recipe);
        likeRepository.save(like);
        // Publish event
        eventPublisher.publishEvent(new RecipeLikedEvent(userTest, recipe));
    }

    @Transactional
    public void unlikeRecipe(MyUserDetails currentUser, Long recipeId) {

        long deletedCount = likeRepository.deleteByUserIdAndRecipeId(currentUser.getId(), recipeId);
        if (deletedCount == 0) {
            throw new CustomException(
                    "Like not found for user id: " + currentUser.getId() + " and recipe id: " + recipeId);
        }

    }

}
