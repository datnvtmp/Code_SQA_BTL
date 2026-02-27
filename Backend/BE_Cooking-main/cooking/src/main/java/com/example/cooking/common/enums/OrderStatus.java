package com.example.cooking.common.enums;


public enum OrderStatus {
        //1.
        // WAITING_SELLER_CONFIRMATION, // Chờ xác nhận từ người bán
        WAITING_PAYMENT,

        //2.
        CONFIRMED_BY_SELLER, // Đã được người bán xác nhận
        CANCELLED_BY_SELLER, // Hủy bởi người bán
        CANCELLED_BY_BUYER, // Hủy bởi người mua
        
        //3.
        PAID,       // Đã thanh toán
        CANCELLED_BY_PAYMENT_FAIL, // Hủy bởi thanh toán failure
        
        //4.
        SHIPPED,    // Đã giao hàng
        DELIVERED,  // Đã nhận hàng
        
        //5.
        COMPLETED,  // Hoàn thành (đã thanh toán cho người bán đơn này, hoặc đã nâp cấp tài khoản)


        PENDING_ACCOUNT_UPGRADE,    // Đang chờ xử lý(chỉ dùng cho đơn hàng nâng cấp tài khoản)

        UNKOWN
        
}
