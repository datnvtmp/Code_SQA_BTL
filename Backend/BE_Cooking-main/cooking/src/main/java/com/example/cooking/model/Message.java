// package com.example.cooking.model;

// import jakarta.persistence.*;
// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// import java.time.LocalDateTime;
// import java.util.ArrayList;
// import java.util.List;

// @Entity
// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// @Table(name = "messages")
// public class Message {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     @Column(name = "message_id")
//     private Long id;

//     @Column(name = "content", columnDefinition = "TEXT")
//     private String content;  // Nullable để hỗ trợ tin nhắn chỉ có media

//     @Column(name = "sent_at", nullable = false)
//     private LocalDateTime sentAt;

//     @Column(name = "is_read", nullable = false)
//     private boolean isRead = false;

//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "sender_id", nullable = false)
//     private User sender;

//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "conversation_id", nullable = false)
//     private Conversation conversation;

//     // Danh sách media (URL hoặc path đến ảnh, video, v.v.)
//     @ElementCollection(fetch = FetchType.LAZY)
//     @CollectionTable(
//         name = "message_media",
//         joinColumns = @JoinColumn(name = "message_id")
//     )
//     @Column(name = "media_url")
//     private List<String> mediaUrls = new ArrayList<>();

//     @PrePersist
//     protected void onCreate() {
//         this.sentAt = LocalDateTime.now();
//     }
// }