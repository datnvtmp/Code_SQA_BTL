package com.example.cooking.repository;

import com.example.cooking.dto.CategoryDTO;
import com.example.cooking.model.Category;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findBySlug(String slug);

    boolean existsByName(String name);

    List<Category> findAllByNameIn(Set<String> names);

    @Query("SELECT new com.example.cooking.dto.CategoryDTO(c.id, c.name, c.slug, c.description, c.imageUrl) " +
            "FROM Category c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<CategoryDTO> searchToDTO(@Param("keyword") String keyword, Pageable pageable);
}
