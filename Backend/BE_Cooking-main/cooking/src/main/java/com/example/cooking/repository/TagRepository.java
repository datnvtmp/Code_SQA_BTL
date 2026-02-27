package com.example.cooking.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.cooking.dto.TagDTO;
import com.example.cooking.model.Tag;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findBySlug(String slug);
    boolean existsByName(String name);
    @Query("SELECT new com.example.cooking.dto.TagDTO(t.id, t.name, t.slug) " +
           "FROM Tag t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<TagDTO> searchToDTO(@Param("keyword") String keyword, Pageable pageable);
}
