package com.example.cooking.model;

import java.time.LocalDateTime;

import com.example.cooking.common.enums.RequestStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chef_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChefRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "admin_note")
    private String adminNote;

    @PrePersist
    void init() {
        createdAt = LocalDateTime.now();
        status = RequestStatus.PENDING;
    }
}
