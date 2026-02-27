// src/main/java/com/example/cooking/service/NotificationService.java
package com.example.cooking.service;

import com.example.cooking.common.PageDTO;
import com.example.cooking.common.enums.NotificationType;
import com.example.cooking.dto.NotificationDTO;
import com.example.cooking.model.*;
import com.example.cooking.repository.NotificationRepository;
import com.example.cooking.repository.UserRepository;
import com.example.cooking.security.MyUserDetails;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public Notification create(
            User recipient,
            NotificationType type,
            String content,
            Recipe recipe,
            Comment comment,
            User actor) {
        if (actor != null && actor.getId().equals(recipient.getId())) {
            return null; // Không tự thông báo chính mình
        }

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setType(type);
        notification.setContent(content);
        notification.setRecipe(recipe);
        notification.setComment(comment);
        notification.setActor(actor);
        notification.setRead(false);
        return notificationRepository.save(notification);
    }

    public PageDTO<NotificationDTO> getNotifications(MyUserDetails currentUser, Pageable pageable) {
        User user = userRepository.getReferenceById(currentUser.getId());
        Page<Notification> notiPage = notificationRepository.findByRecipientOrderByCreatedAtDesc(user, pageable);

        // Map tạm trong service
        Page<NotificationDTO> dtoPage = notiPage.map(n -> {
            NotificationDTO dto = new NotificationDTO();
            dto.setId(n.getId());
            dto.setType(n.getType());
            dto.setContent(n.getContent());
            dto.setRead(n.isRead());
            dto.setCreatedAt(n.getCreatedAt());
            dto.setRecipeId(n.getRecipe() != null ? n.getRecipe().getId() : null);
            dto.setCommentId(n.getComment() != null ? n.getComment().getId() : null);
            dto.setActorId(n.getActor() != null ? n.getActor().getId() : null);
            return dto;
        });

        return new PageDTO<>(dtoPage, dtoPage.getContent());
    }

    public Long getUnreadCount(MyUserDetails currentUser) {
        User user = userRepository.getReferenceById(currentUser.getId());
        return notificationRepository.countByRecipientAndIsReadFalse(user);
    }

    @Transactional
    public int markAllAsRead(MyUserDetails currentUser) {
        User user = userRepository.getReferenceById(currentUser.getId());
        return notificationRepository.markAllAsRead(user);
    }

    @Transactional
    public int markAsRead(Long notificationId, MyUserDetails currentUser) {
        User user = userRepository.getReferenceById(currentUser.getId());
        return notificationRepository.markAsRead(notificationId, user);
    }
}