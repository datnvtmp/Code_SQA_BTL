package com.example.cooking.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.cooking.common.PageDTO;
import com.example.cooking.dto.IngredientDTO;
import com.example.cooking.dto.projection.IngredientTopUsageProjection;
import com.example.cooking.model.Ingredient;
import com.example.cooking.repository.IngredientRepository;
import com.example.cooking.util.IngredientNormalizer;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IngredientService {

    private final IngredientRepository ingredientRepository;

    public Ingredient findOrCreateIngredient(String rawName) {
        String normalized = IngredientNormalizer.normalizeIngredientName(rawName);

        // Tìm theo normalized name
        Optional<Ingredient> existing = ingredientRepository.findByNormalizedName(normalized);

        if (existing.isPresent()) {
            return existing.get();
        }

        // Không có → tạo mới
        Ingredient newIngredient = new Ingredient();
        newIngredient.setName(rawName.trim());       // tên hiển thị
        newIngredient.setNormalizedName(normalized); // tên chuẩn hóa để tìm kiếm

        Ingredient saved = ingredientRepository.save(newIngredient);
        // ingredientRepository.flush(); // flush ID ngay
        return saved;
    }

    public PageDTO<IngredientDTO> searchByKeyWord(String keyword, Pageable pageable){
        Page<IngredientDTO> page = ingredientRepository.findByNameContainingIgnoreCase(keyword, pageable);
        return new PageDTO<>(page);
    }

    public PageDTO<IngredientTopUsageProjection> getTop10Ingredients(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<IngredientTopUsageProjection> pageResult = ingredientRepository.findTopIngredientsByRecipeCount(pageable);
        return new PageDTO<IngredientTopUsageProjection>(pageResult);
    }
}
