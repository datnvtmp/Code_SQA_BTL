package com.example.cooking.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "recipe_daily_views", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"recipe_id", "view_date"})
})
@Data
@NoArgsConstructor
public class RecipeDailyView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    @Column(name = "view_date", nullable = false)
    private LocalDate viewDate;  // chỉ lưu ngày, không cần giờ

    @Column(name = "view_count", nullable = false)
    private Long viewCount = 0L;
}
