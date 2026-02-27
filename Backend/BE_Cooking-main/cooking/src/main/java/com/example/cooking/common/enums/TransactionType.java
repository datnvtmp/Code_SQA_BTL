package com.example.cooking.common.enums;


public enum TransactionType {
    ORDER_REVENUE,    // Nhận tiền đơn hàng
    RELEASE_PENDING,  // Chuyển tiền từ tạm giữ sang khả dụng
    WITHDRAW,         // Rút tiền
    REFUND            // Hoàn tiền
}
