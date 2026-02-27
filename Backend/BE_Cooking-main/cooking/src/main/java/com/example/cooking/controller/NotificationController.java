package com.example.cooking.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cooking.common.ApiResponse;
import com.example.cooking.common.PageDTO;
import com.example.cooking.dto.NotificationDTO;
import com.example.cooking.security.MyUserDetails;
import com.example.cooking.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user/notification")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    public  ResponseEntity<ApiResponse<PageDTO<NotificationDTO>>> getNoti(@AuthenticationPrincipal MyUserDetails currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.ok(notificationService.getNotifications(currentUser, pageable));
    }
    @GetMapping("/count-unread")
    public  ResponseEntity<ApiResponse<Long>> getCountUnread(@AuthenticationPrincipal MyUserDetails currentUser) {
        return ApiResponse.ok(notificationService.getUnreadCount(currentUser));
    }

    // Đánh dấu tất cả thông báo là đã đọc
    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(@AuthenticationPrincipal MyUserDetails currentUser) {
        int updatedCount = notificationService.markAllAsRead(currentUser);
        return ApiResponse.ok("Đã đánh dấu " + updatedCount + " thông báo là đã đọc");
    }

    // Đánh dấu 1 thông báo cụ thể là đã đọc
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal MyUserDetails currentUser
    ) {
        int updated = notificationService.markAsRead(id, currentUser);
        if (updated > 0) {
            return ApiResponse.ok("Thông báo đã được đánh dấu là đã đọc");
        } else {
            return ApiResponse.error(HttpStatus.BAD_REQUEST,"Không tìm thấy hoặc không có quyền cập nhật thông báo này");
        }
    }
}
