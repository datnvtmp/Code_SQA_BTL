package com.example.cooking.dto.paymentDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VnPayQuerydrResponse {
    // Các tham số bắt buộc theo tài liệu VNPAY
    private String vnp_ResponseId;
    private String vnp_Command;
    private String vnp_ResponseCode; // Mã phản hồi API (00: Thành công)
    private String vnp_Message;
    private String vnp_TmnCode;
    private String vnp_TxnRef;
    private Long vnp_Amount; // Số tiền (đã nhân 100)
    private String vnp_BankCode;
    private String vnp_PayDate;
    private String vnp_TransactionNo;
    private String vnp_TransactionType;
    private String vnp_TransactionStatus; // Tình trạng thanh toán (00: Thành công)
    private String vnp_OrderInfo;
    private String vnp_SecureHash;

    // Các trường khác (Tùy chọn)
    private String vnp_PromotionCode;
    private Long vnp_PromotionAmount;
}
