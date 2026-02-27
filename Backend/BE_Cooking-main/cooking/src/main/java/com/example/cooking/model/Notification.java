package com.example.cooking.model;

import com.example.cooking.common.enums.NotificationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private NotificationType type;  // Loại thông báo (LIKE, COMMENT, FOLLOW, v.v.)

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;  // Nội dung thông báo (e.g., "UserX liked your recipe")

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;  // Người nhận thông báo

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;  // Liên quan đến recipe (nếu có)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id")
    private Comment comment;  // Liên quan đến comment (nếu có)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id")  // Người gây ra sự kiện (e.g., người like, người follow)
    private User actor;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}