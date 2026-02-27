package com.example.cooking.model;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.BatchSize;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="steps")
public class Step {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "step_id")
    private Long id;

    @Column(name = "step_number", nullable = false)
    private Integer stepNumber;

    @Column(name= "step_time", nullable = true)
    private Long stepTime;

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    @Lob
    private String description;

    // List các URL ảnh
    @ElementCollection(fetch = FetchType.LAZY)
    @BatchSize(size = 10)
    @CollectionTable(
        name = "step_images", 
        joinColumns = @JoinColumn(name = "step_id")
    )
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn (name = "recipe_id", nullable = false)
    private Recipe recipe;

}
