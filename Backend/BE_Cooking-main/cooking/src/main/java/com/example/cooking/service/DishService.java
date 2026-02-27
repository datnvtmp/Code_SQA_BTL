package com.example.cooking.service;

import com.example.cooking.common.PageDTO;
import com.example.cooking.common.enums.DishStatus;
import com.example.cooking.common.enums.FileType;
import com.example.cooking.dto.DishDTO;
import com.example.cooking.dto.mapper.DishMapper;
import com.example.cooking.dto.request.DishCreateDTO;
import com.example.cooking.exception.CustomException;
import com.example.cooking.model.Dish;
import com.example.cooking.model.Recipe;
import com.example.cooking.model.User;
import com.example.cooking.repository.DishRepository;
import com.example.cooking.repository.RecipeRepository;
import com.example.cooking.repository.UserRepository;
import com.example.cooking.security.MyUserDetails;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DishService {

    private final DishRepository dishRepository;
    private final RecipeRepository recipeRepository;
    private final DishMapper dishMapper;
    private final UserRepository userRepository;
    private final UploadFileService uploadFileService;

    public DishDTO addDish(DishCreateDTO dto, MyUserDetails currentUser) {
        User sellUser = userRepository.getReferenceById(currentUser.getId());
        Recipe recipe = null;
        if (dto.getRecipeId() != null) {
            recipe = recipeRepository.findById(dto.getRecipeId())
                    .orElseThrow(() -> new CustomException("Recipe not found"));

            if (!recipe.getUser().getId().equals(currentUser.getId())) {
                throw new CustomException("You do not have permission to add a dish to this recipe");
            }
        }


        
        Dish dish = new Dish();
                // them anh chinh
        if (!(dto.getImage() == null || dto.getImage().isEmpty())) {
            String mainImageUrl = uploadFileService.saveFile(dto.getImage(), FileType.DISH);
            dish.setImageUrl(mainImageUrl);
        } else
            dish.setImageUrl("/static_resource/public/upload/avatars/avatar-holder.png");
        dish.setName(dto.getName());
        dish.setDescription(dto.getDescription());
        dish.setPrice(dto.getPrice());
        dish.setRecipe(recipe);
        dish.setRemainingServings(dto.getRemainingServings());
        dish.setStatus(DishStatus.ACTIVE);
        syncStatusWithRemaining(dish);
        dish.setSellUser(sellUser);

        return dishMapper.toDTO(dishRepository.save(dish));
    }

    public DishDTO updateDish(Long dishId, DishCreateDTO dto, MyUserDetails currentUser) {

        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new CustomException("Dish not found"));

        // check ownership theo seller, KHÔNG theo recipe
        if (!dish.getSellUser().getId().equals(currentUser.getId())) {
            throw new CustomException("You do not have permission to update this dish");
        }

        Recipe recipe = null;
        if (dto.getRecipeId() != null) {
            recipe = recipeRepository.findById(dto.getRecipeId())
                    .orElseThrow(() -> new CustomException("Recipe not found"));

            if (!recipe.getUser().getId().equals(currentUser.getId())) {
                throw new CustomException("You do not have permission to use this recipe");
            }
        }

        dish.setName(dto.getName());
        dish.setDescription(dto.getDescription());
        dish.setPrice(dto.getPrice());
        dish.setRecipe(recipe); // có thể null
        dish.setRemainingServings(dto.getRemainingServings());
        syncStatusWithRemaining(dish);

        return dishMapper.toDTO(dishRepository.save(dish));
    }

    public void deleteDish(Long dishId, MyUserDetails currentUser) {

        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new CustomException("Dish not found"));

        if (!dish.getSellUser().getId().equals(currentUser.getId())) {
            throw new CustomException("You do not have permission to delete this dish");
        }

        dishRepository.delete(dish);
    }

    public PageDTO<DishDTO> getDishByUser(Long userId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);

        Page<Dish> result = dishRepository.findBySellUserId(userId, pageable);

        return new PageDTO<>(result, dishMapper.toDTOs(result.getContent()));
    }
    public DishDTO getDishById(Long dishId) {

        Dish dish = dishRepository.findById(dishId).orElseThrow(()->new CustomException("Dish khong ton tai"));

        return dishMapper.toDTO(dish);
    }

    public PageDTO<DishDTO> getDishByRecipe(Long recipeId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);

        Page<Dish> result = dishRepository.findByRecipeId(recipeId, pageable);

        return new PageDTO<>(result, dishMapper.toDTOs(result.getContent()));
    }


        // --- Bật/tắt món ---
    public DishDTO toggleDishStatus(Long dishId, MyUserDetails currentUser) {
        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new CustomException("Dish not found"));

        if (!dish.getSellUser().getId().equals(currentUser.getId())) {
            throw new CustomException("You do not have permission to change this dish");
        }

        if (dish.getStatus() == DishStatus.INACTIVE) {
            dish.setStatus(DishStatus.ACTIVE);
        } else if (dish.getStatus() == DishStatus.ACTIVE) {
            dish.setStatus(DishStatus.INACTIVE);
        }
        // Nếu là OUT_OF_STOCK hoặc DISABLED, không đổi

        return dishMapper.toDTO(dishRepository.save(dish));
    }

        // --- Thêm số lượng món ---
    public DishDTO addRemainingServings(Long dishId, Long additionalServings, MyUserDetails currentUser) {
        if (additionalServings <= 0) {
            throw new CustomException("Additional servings must be positive");
        }

        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new CustomException("Dish not found"));

        if (!dish.getSellUser().getId().equals(currentUser.getId())) {
            throw new CustomException("You do not have permission to update this dish");
        }

        dish.setRemainingServings(dish.getRemainingServings() + additionalServings);
        syncStatusWithRemaining(dish);

        return dishMapper.toDTO(dishRepository.save(dish));
    }

        // --- Bật/tắt tất cả món của user ---
    public void toggleAllDishesForUser(MyUserDetails currentUser, boolean activate) {
        Page<Dish> dishes = dishRepository.findBySellUserId(currentUser.getId(), PageRequest.of(0, Integer.MAX_VALUE));

        for (Dish dish : dishes.getContent()) {
            if (dish.getStatus() != DishStatus.DISABLED && dish.getStatus() != DishStatus.OUT_OF_STOCK) {
                dish.setStatus(activate ? DishStatus.ACTIVE : DishStatus.INACTIVE);
            }
        }

        dishRepository.saveAll(dishes.getContent());
    }

    public void syncStatusWithRemaining(Dish dish) {
        if (dish.getRemainingServings() <= 0) {
            dish.setStatus(DishStatus.OUT_OF_STOCK);
        } else if (dish.getStatus() != DishStatus.INACTIVE) {
            dish.setStatus(DishStatus.ACTIVE);
        }
    }

}
