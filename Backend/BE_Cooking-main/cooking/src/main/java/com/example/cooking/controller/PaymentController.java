package com.example.cooking.controller;
import com.example.cooking.dto.paymentDTO.VNPayIpnResponse;
import com.example.cooking.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {
    @Value("${app.frontend-url}")
    private String frontendUrl;

    private final PaymentService paymentService;


    /**
     * VNPay IPN URL - Nhận thông báo kết quả thanh toán từ VNPay
     * Endpoint: GET /api/payment/vnpay/ipn
     * QUAN TRỌNG: URL này phải public và có SSL trong production
     */
    @GetMapping("/vnpay/ipn")
    public ResponseEntity<VNPayIpnResponse> vnpayIpn(HttpServletRequest request) {
        try {
            log.info("Received VNPay IPN callback");

            // Lấy tất cả params từ request
            Map<String, String> params = new HashMap<>();
            request.getParameterMap().forEach((key, values) -> {
                if (values.length > 0) {
                    params.put(key, values[0]);
                }
            });

            // Xử lý IPN
            VNPayIpnResponse response = paymentService.handleIpn(params);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error processing IPN", e);
            return ResponseEntity.ok(VNPayIpnResponse.builder()
                    .RspCode("99")
                    .Message("Unknown error")
                    .build());
        }
    }

    // /**
    //  * VNPay Return URL - Hiển thị kết quả cho user sau khi thanh toán
    //  * Endpoint: GET /api/payment/vnpay/return
    //  * Frontend sẽ redirect user đến trang này
    //  */
    // @GetMapping("/vnpay/return01")
    // public ResponseEntity<PaymentReturnResponse> vnpayReturn01(
    //         @RequestParam Map<String, String> params) {
    //     try {
    //         log.info("User returned from VNPay");

    //         String responseCode = params.get("vnp_ResponseCode");
    //         String txnRef = params.get("vnp_TxnRef");
    //         String transactionNo = params.get("vnp_TransactionNo");
    //         String amountStr = params.get("vnp_Amount");
    //         String orderInfo = params.get("vnp_OrderInfo");

    //         Long amount = null;
    //         if (amountStr != null) {
    //             amount = Long.parseLong(amountStr) / 100; // Chia 100 để ra số tiền gốc
    //         }

    //         boolean success = "00".equals(responseCode);
    //         String message = success ? "Thanh toán thành công" : "Thanh toán thất bại";

    //         PaymentReturnResponse response = PaymentReturnResponse.builder()
    //                 .success(success)
    //                 .message(message)
    //                 .txnRef(txnRef)
    //                 .amount(amount)
    //                 .orderInfo(orderInfo)
    //                 .responseCode(responseCode)
    //                 .transactionNo(transactionNo)
    //                 .build();

    //         return ResponseEntity.ok(response);

    //     } catch (Exception e) {
    //         log.error("Error processing return", e);
    //         return ResponseEntity.ok(PaymentReturnResponse.builder()
    //                 .success(false)
    //                 .message("Có lỗi xảy ra")
    //                 .build());
    //     }
    // }

    // // Trong PaymentController.java
    // // Cần đảm bảo bạn đã inject PaymentService: private final PaymentService
    // // paymentService;

    // /**
    //  * VNPay Return URL - Hiển thị kết quả cho user sau khi thanh toán
    //  * Endpoint: GET /api/payment/vnpay/return
    //  * Frontend sẽ redirect user đến trang này
    //  */
    // @GetMapping("/vnpay/return02")
    // public ResponseEntity<PaymentReturnResponse> vnpayReturn02(
    //         @RequestParam Map<String, String> params) {
    //     try {
    //         log.info("User returned from VNPay. Params: {}", params);

    //         // 1. GỌI SERVICE để xử lý logic, kiểm tra Hash và gọi QueryDR
    //         // serviceResult chứa RspCode và Message đã được xác nhận.
    //         Map<String, Object> serviceResult = paymentService.handleReturn(params);

    //         // 2. Lấy kết quả cuối cùng từ Service Result
    //         String finalRspCode = (String) serviceResult.get("RspCode");
    //         String message = (String) serviceResult.get("Message");
    //         boolean success = "00".equals(finalRspCode);

    //         // Lấy lại các thông tin hiển thị từ params
    //         String txnRef = params.get("vnp_TxnRef");
    //         String transactionNo = params.get("vnp_TransactionNo");
    //         String amountStr = params.get("vnp_Amount");
    //         String orderInfo = params.get("vnp_OrderInfo");

    //         Long amount = null;
    //         if (amountStr != null) {
    //             // VNPAY trả về số tiền đã nhân 100, cần chia lại để hiển thị
    //             amount = Long.parseLong(amountStr) / 100;
    //         }

    //         // 3. Trả về Response cho Frontend
    //         PaymentReturnResponse response = PaymentReturnResponse.builder()
    //                 .success(success)
    //                 // Sử dụng message đã được Service xác nhận (có thể là message lỗi QueryDR)
    //                 .message(message)
    //                 .txnRef(txnRef)
    //                 .amount(amount)
    //                 .orderInfo(orderInfo)
    //                 // Sử dụng mã phản hồi cuối cùng từ logic QueryDR trong Service
    //                 .responseCode(finalRspCode)
    //                 .transactionNo(transactionNo)
    //                 .build();

    //         return ResponseEntity.ok(response);

    //     } catch (Exception e) {
    //         log.error("Error processing return", e);
    //         // Trả về lỗi chung nếu có exception xảy ra trong quá trình xử lý
    //         return ResponseEntity.ok(PaymentReturnResponse.builder()
    //                 .success(false)
    //                 .message("Có lỗi xảy ra trong quá trình xử lý kết quả.")
    //                 .build());
    //     }
    // }

    @GetMapping("/vnpay/return")
    public ResponseEntity<String> vnpayReturn(@RequestParam Map<String, String> params) {
        try {
            log.info("User returned from VNPay. Params: {}", params);

            // 1. GỌI SERVICE để xử lý logic, kiểm tra Hash và gọi QueryDR
            // serviceResult chứa RspCode và Message đã được xác nhận.
            Map<String, Object> serviceResult = paymentService.handleReturn(params);

            // 2. Lấy kết quả cuối cùng từ Service Result
            String finalRspCode = (String) serviceResult.get("RspCode");
            String message = (String) serviceResult.get("Message");
            boolean success = "00".equals(finalRspCode);

            // Lấy lại các thông tin hiển thị từ params
            String txnRef = params.get("vnp_TxnRef");
            String transactionNo = params.get("vnp_TransactionNo");
            String amountStr = params.get("vnp_Amount");
            String orderInfo = params.get("vnp_OrderInfo");

            Long amount = null;
            if (amountStr != null) {
                // VNPAY trả về số tiền đã nhân 100, cần chia lại để hiển thị
                amount = Long.parseLong(amountStr) / 100;
            }
            String status = success ? "success" : "fail";
            String redirectUrl = frontendUrl 
                    + "/payment-result"
                    + "?status=" + status
                    + "&code=" + finalRspCode   // luôn có mã 00, 24, 97...
                    + "&orderId=" + (txnRef != null ? txnRef : "");

            ///////
            String html = """
                    <html>
                        <head>
                            <meta charset="UTF-8">
                            <title>VNPay Result</title>
                            <style>
                                body { font-family: Arial; padding: 40px; text-align: center; }
                                .box { border: 1px solid #ccc; padding: 20px; border-radius: 8px; display: inline-block; }
                                .btn { margin-top: 20px; padding: 10px 20px; background: #007bff; color: #fff;
                                    text-decoration: none; border-radius: 5px; }
                                .info { margin-top: 10px; font-size: 16px; }
                            </style>
                        </head>
                        <body>
                            <div class="box">
                                <h2>%s</h2>

                                <div class="info">
                                    <p>Mã giao dịch (TxnRef): %s</p>
                                    <p>Mã GD VNPay (TransactionNo): %s</p>
                                    <p>Số tiền: %s VND</p>
                                    <p>Nội dung: %s</p>
                                </div>

                                <a class="btn" href="%s">Về trang chủ</a>
                            </div>
                        </body>
                    </html>
                    """
                    .formatted(
                            message,
                            txnRef != null ? txnRef : "",
                            transactionNo != null ? transactionNo : "",
                            amount != null ? amount.toString() : "0",
                            orderInfo != null ? orderInfo : "",
                            redirectUrl);

            return ResponseEntity.ok()
                    .header("Content-Type", "text/html; charset=UTF-8")
                    .body(html);

        } catch (Exception e) {

                // Log lỗi ra console hoặc file log
    e.printStackTrace(); // log stack trace
    System.out.println("Lỗi xảy ra trong processPaymentResult: " + e.getMessage());

            String html = """
                    <html><body><h2>Có lỗi xảy ra</h2></body></html>
                    """;
            return ResponseEntity.ok()
                    .header("Content-Type", "text/html; charset=UTF-8")
                    .body(html);
        }
    }

}