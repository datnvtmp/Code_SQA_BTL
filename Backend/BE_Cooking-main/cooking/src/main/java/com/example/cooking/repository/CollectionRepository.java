package com.example.cooking.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import com.example.cooking.model.Collection;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, Long> {
    boolean existsByNameAndUserId(String name, Long userId);

    @EntityGraph(attributePaths = {"user"})
    Page<Collection> findByUserId(Long userId, Pageable pageable);

    @EntityGraph(attributePaths = {"user"})
    Page<Collection> findByUserIdAndIsPublicTrue(Long userId, Pageable pageable);




}
