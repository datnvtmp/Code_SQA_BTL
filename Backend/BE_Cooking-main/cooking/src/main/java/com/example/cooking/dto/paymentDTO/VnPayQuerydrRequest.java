package com.example.cooking.dto.paymentDTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VnPayQuerydrRequest {
    private String vnp_RequestId; // Bắt buộc
    private String vnp_Version; // Bắt buộc, 2.1.0
    private String vnp_Command; // Bắt buộc, "querydr"
    private String vnp_TmnCode; // Bắt buộc
    private String vnp_TxnRef; // Bắt buộc (Mã đơn hàng của bạn)
    private String vnp_OrderInfo; // Bắt buộc
    private String vnp_TransactionDate; // Bắt buộc (Thời gian giao dịch gốc)
    private String vnp_CreateDate; // Bắt buộc (Thời gian tạo request)
    private String vnp_IpAddr; // Bắt buộc
    private String vnp_SecureHash; // Bắt buộc
}
