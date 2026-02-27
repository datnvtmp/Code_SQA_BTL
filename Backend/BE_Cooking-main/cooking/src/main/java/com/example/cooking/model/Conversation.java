// package com.example.cooking.model;

// import jakarta.persistence.*;
// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// import java.time.LocalDateTime;
// import java.util.HashSet;
// import java.util.Set;

// @Entity
// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// @Table(name = "conversations")
// public class Conversation {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     @Column(name = "conversation_id")
//     private Long id;

//     @Column(name = "title")  // Tùy chọn, cho group chat
//     private String title;

//     @Column(name = "is_group", nullable = false)
//     private boolean isGroup = false;

//     @Column(name = "created_at", nullable = false)
//     private LocalDateTime createdAt;

//     @Column(name = "updated_at", nullable = false)
//     private LocalDateTime updatedAt;

//     @ManyToMany(fetch = FetchType.LAZY)
//     @JoinTable(
//         name = "conversation_participants",
//         joinColumns = @JoinColumn(name = "conversation_id"),
//         inverseJoinColumns = @JoinColumn(name = "user_id")
//     )
//     private Set<User> participants = new HashSet<>();  // Danh sách users tham gia

//     @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
//     @OrderBy("sentAt ASC")
//     private Set<Message> messages = new HashSet<>();

//     @PrePersist
//     protected void onCreate() {
//         this.createdAt = LocalDateTime.now();
//         this.updatedAt = this.createdAt;
//     }

//     @PreUpdate
//     protected void onUpdate() {
//         this.updatedAt = LocalDateTime.now();
//     }
// }