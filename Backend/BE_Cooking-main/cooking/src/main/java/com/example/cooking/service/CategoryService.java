package com.example.cooking.service;

import com.example.cooking.common.PageDTO;
import com.example.cooking.common.enums.FileType;
import com.example.cooking.dto.CategoryDTO;
import com.example.cooking.dto.mapper.CategoryMapper;
import com.example.cooking.dto.request.CategoryRequestDTO;
import com.example.cooking.exception.CustomException;
import com.example.cooking.model.Category;
import com.example.cooking.repository.CategoryRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final UploadFileService uploadFileService;

    public PageDTO<CategoryDTO> getAllCategories(Pageable pageable) {
        Page<Category> categoryPage = categoryRepository.findAll(pageable);
        if(categoryPage.isEmpty()){
            return PageDTO.empty(pageable);
        }
        List<CategoryDTO> categoryResponseDTOs = categoryMapper.toDTO(categoryPage.getContent());
        return new PageDTO<>(categoryPage, categoryResponseDTOs);
    }

    public CategoryDTO getCategoryById(Long id) {
        CategoryDTO categoryResponseDTO = categoryMapper.toDTO(categoryRepository.findById(id).orElseThrow(()-> new CustomException("Category not found")));
        return categoryResponseDTO;
    }

    public CategoryDTO getCategoryBySlug(String slug) {
        CategoryDTO categoryResponseDTO = categoryMapper.toDTO(categoryRepository.findBySlug(slug).orElseThrow(()-> new CustomException("Category not found")));
        return categoryResponseDTO;
    }

    public CategoryDTO createCategory(CategoryRequestDTO requestDTO) {
        Category category = categoryMapper.toEntity(requestDTO);
        if (categoryRepository.existsByName(category.getName())) {
            throw new CustomException("Category with this name already exists");
        }
        if (!(requestDTO.getImage() == null || requestDTO.getImage().isEmpty())) {
            String imageUrl = uploadFileService.saveFile(requestDTO.getImage(), FileType.CATEGORYIMAGE);
            category.setImageUrl(imageUrl);
        } else
            category.setImageUrl("/static_resource/public/upload/category_images/category-holder.png");
        return categoryMapper.toDTO(categoryRepository.save(category));
    }

    public CategoryDTO updateCategory(Long id, CategoryRequestDTO updatedCategoryRequestDTO) {

        Category updatedCategory = categoryMapper.toEntity(updatedCategoryRequestDTO);

        return categoryMapper.toDTO(categoryRepository.findById(id).map(category -> {
            category.setName(updatedCategory.getName());
            category.setDescription(updatedCategory.getDescription());
            // slug sẽ tự động được generate bởi @PrePersist/@PreUpdate
            return categoryRepository.save(category);
        }).orElseThrow(() -> new CustomException("Category not found")));
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CustomException("Category not found with id " + id));
        categoryRepository.delete(category);
    }
    @Transactional
    public List<CategoryDTO> createCategories(List<CategoryRequestDTO> categoriesRequestDTOs) {
        List<Category> categories = categoryMapper.toEntity(categoriesRequestDTOs);
        // Lấy tất cả tên category trong request
        Set<String> setRequest = categories.stream()
                .map(Category::getName)
                .collect(Collectors.toSet());

        // Lấy tên đã tồn tại trong DB trong 1 lần query
        Set<String> tenDaTonTai = categoryRepository.findAllByNameIn(setRequest)
                .stream()
                .map(Category::getName)
                .collect(Collectors.toSet());

        // Nếu có tên trùng, ném lỗi
        if (!tenDaTonTai.isEmpty()) {
            throw new CustomException(
                    "Các category đã tồn tại: " + String.join(", ", tenDaTonTai));
        }

        // Lưu tất cả category mới
        return categoryMapper.toDTO(categoryRepository.saveAll(categories));
    }

    /**
     * Autocomplete ingredients by keyword, return top 10 results
     */
    public List<CategoryDTO> autocomplete(String keyword) {
        Pageable topTen = PageRequest.of(0, 10);
        return categoryRepository.searchToDTO(keyword, topTen);
    }
}
