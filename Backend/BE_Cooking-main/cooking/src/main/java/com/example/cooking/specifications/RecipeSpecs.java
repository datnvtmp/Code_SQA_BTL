package com.example.cooking.specifications;

import org.springframework.data.jpa.domain.Specification;

import com.example.cooking.common.enums.Scope;
import com.example.cooking.common.enums.Status;
import com.example.cooking.model.Recipe;

public class RecipeSpecs {

    public static Specification<Recipe> hasUserId(Long userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Recipe> hasStatus(Status status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Recipe> hasScope(Scope scope) {
        return (root, query, cb) -> scope == null ? null : cb.equal(root.get("scope"), scope);
    }

    public static Specification<Recipe> titleContains(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return null;
            return cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%");
        };
    }

    public static Specification<Recipe> isNotDeleted() {
        return (root, query, cb) -> cb.notEqual(root.get("status"), Status.DELETED); // nếu có DELETED
    }
}