package com.example.cooking.repository;

import com.example.cooking.model.Notification;
import com.example.cooking.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // 1. Lấy danh sách thông báo của 1 user, phân trang, mới nhất trước
    Page<Notification> findByRecipientOrderByCreatedAtDesc(User recipient, Pageable pageable);

    // 2. Lấy thông báo chưa đọc
    Page<Notification> findByRecipientAndIsReadFalseOrderByCreatedAtDesc(User recipient, Pageable pageable);

    // 3. Đếm số thông báo chưa đọc
    long countByRecipientAndIsReadFalse(User recipient);

    // 4. Đánh dấu tất cả thông báo của user là đã đọc
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.recipient = :recipient AND n.isRead = false")
    int markAllAsRead(@Param("recipient") User recipient);

    // 5. Đánh dấu 1 thông báo cụ thể là đã đọc
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.id = :id AND n.recipient = :recipient")
    int markAsRead(@Param("id") Long notificationId, @Param("recipient") User recipient);
}