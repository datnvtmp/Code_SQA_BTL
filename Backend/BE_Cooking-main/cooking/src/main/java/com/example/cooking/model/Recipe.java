package com.example.cooking.model;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import com.example.cooking.common.enums.Difficulty;
import com.example.cooking.common.enums.Scope;
import com.example.cooking.common.enums.Status;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Data
@EqualsAndHashCode(exclude = {"views","steps","recipeIngredients","categories","tags"})
@AllArgsConstructor
@NoArgsConstructor
@Table (name="recipes")
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name="recipe_id")
    private Long id;

    @Column(name = "title", nullable=false)
    private String title;

    @Column(name= "description", columnDefinition = "TEXT", nullable = true)
    @Lob
    private String description;

    @Column(name= "servings", nullable = false)
    private Long servings;

    @Column(name= "prep_time", nullable = false)
    private Long prepTime;

    @Column(name= "cook_time", nullable = false)
    private Long cookTime;

    @Column(name ="difficulty", nullable = false)
    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @Column(name= "created_at", nullable = false)
    private LocalDateTime createdAt;


    @Column(name= "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name= "image_url", nullable = true)
    private String imageUrl;

    @Column(name = "video_url", nullable = true)
    private String videoUrl;


    @Column(name = "views", nullable = false)
    private Long views = 0L;

    @Column(name= "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name= "scope", nullable = false)
    @Enumerated(EnumType.STRING)
    private Scope scope;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable=false)
    private User user;

    @OneToMany(mappedBy = "recipe", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("stepNumber ASC")
    private Set<Step> steps = new LinkedHashSet<>();

    @OneToMany(mappedBy = "recipe", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    private Set<RecipeIngredient> recipeIngredients = new LinkedHashSet<>();



    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "recipe_category",
        joinColumns = @JoinColumn(name = "recipe_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new LinkedHashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "recipe_tag",
        joinColumns = @JoinColumn(name = "recipe_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new LinkedHashSet<>();

    //NEW
    // @OneToMany(mappedBy = "recipe",fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    // private Set<Dish> dishes;
    //
    
    @PrePersist
    protected void onCreate(){
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate(){
        this.updatedAt=LocalDateTime.now();
    }

}
