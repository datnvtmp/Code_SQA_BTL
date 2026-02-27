package com.example.cooking.model;

import com.example.cooking.common.enums.DishStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.Data;

@Entity
@Data
@Table(name = "dish")
public class Dish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dish_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User sellUser;

    @Column(name= "name", nullable = false)
    private String name;
    

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name= "img_url", nullable = true)
    private String imageUrl;

    private Long price;

    @Column(nullable = false)
    private Long remainingServings;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)   
    private DishStatus status;

    

    @ManyToOne
    @JoinColumn(name = "recipe_id", nullable = true)
    private Recipe recipe;

    @Version
@Column(nullable = false)
private Long version;

}
