package com.example.cooking.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "recipe_search_index")
public class RecipeSearchIndex {
    @Id
    private Long recipeId;

    @Lob
    private String searchText;

    @OneToOne
    @MapsId
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;
}
