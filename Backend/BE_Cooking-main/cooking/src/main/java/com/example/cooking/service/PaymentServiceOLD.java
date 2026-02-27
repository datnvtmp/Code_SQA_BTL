// package com.example.cooking.service;

// import com.example.cooking.common.enums.OrderStatus;
// import com.example.cooking.common.enums.PaymentStatus;
// import com.example.cooking.config.VNPayConfig;
// import com.example.cooking.dto.paymentDTO.PaymentRequest;
// import com.example.cooking.dto.paymentDTO.PaymentResponse;
// import com.example.cooking.dto.paymentDTO.VNPayIpnResponse;
// import com.example.cooking.dto.paymentDTO.VnPayQuerydrRequest;
// import com.example.cooking.dto.paymentDTO.VnPayQuerydrResponse;
// import com.example.cooking.model.Order;
// import com.example.cooking.model.PaymentOrder;
// import com.example.cooking.model.DishOrder;
// import com.example.cooking.model.RoleEntity;
// import com.example.cooking.model.UpgradeOrder;
// import com.example.cooking.model.User;
// import com.example.cooking.repository.OrderRepository;
// import com.example.cooking.repository.PaymentOrderRepository;
// import com.example.cooking.repository.RoleRepository;
// import com.example.cooking.repository.UserRepository;
// import jakarta.servlet.http.HttpServletRequest;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;

// import org.hibernate.Hibernate;
// import org.springframework.http.HttpEntity;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.MediaType;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;
// import org.springframework.web.client.RestTemplate;

// import java.io.UnsupportedEncodingException;
// import java.net.URLEncoder;
// import java.nio.charset.StandardCharsets;
// import java.text.SimpleDateFormat;
// import java.time.LocalDateTime;
// import java.util.*;

// @Service
// @RequiredArgsConstructor
// @Slf4j
// public class PaymentService {

//     private final VNPayConfig vnPayConfig;
//     private final PaymentOrderRepository paymentOrderRepository;
//     private final OrderRepository orderRepository;
//     private final UserRepository userRepository;
//     private final RoleRepository roleRepository;
//     // new
//     private final RestTemplate restTemplate;
//     /**
//      * Tạo URL thanh toán VNPay
//      */
//     public PaymentResponse createPayment(HttpServletRequest request, PaymentRequest paymentRequest)
//             throws UnsupportedEncodingException {

//         // Tạo mã giao dịch unique
//         String txnRef = generateUniqueTxnRef();

//         // Tính số tiền (nhân 100 để bỏ phần thập phân)
//         long amount = paymentRequest.getAmount() * 100;
//         // Tạo PaymentOrder
//         PaymentOrder paymentOrder = PaymentOrder.builder()
//                 .order(paymentRequest.getOrder())
//                 .txnRef(txnRef)
//                 .amount(amount)
//                 .paymentStatus(PaymentStatus.PENDING)
//                 .build();

//         paymentOrderRepository.save(paymentOrder);

//         // Build VNPay payment parameters
//         Map<String, String> vnpParams = new HashMap<>();
//         vnpParams.put("vnp_Version", vnPayConfig.getVersion());
//         vnpParams.put("vnp_Command", vnPayConfig.getCommand());
//         vnpParams.put("vnp_TmnCode", vnPayConfig.getTmnCode());
//         vnpParams.put("vnp_Amount", String.valueOf(amount));
//         vnpParams.put("vnp_CurrCode", "VND");

//         if (paymentRequest.getBankCode() != null && !paymentRequest.getBankCode().isEmpty()) {
//             vnpParams.put("vnp_BankCode", paymentRequest.getBankCode());
//         }

//         vnpParams.put("vnp_TxnRef", txnRef);
//         vnpParams.put("vnp_OrderInfo", paymentRequest.getOrder().getOrderInfo());
//         vnpParams.put("vnp_OrderType", vnPayConfig.getOrderType());

//         String locale = paymentRequest.getLanguage();
//         if (locale == null || locale.isEmpty()) {
//             locale = "vn";
//         }
//         vnpParams.put("vnp_Locale", locale);

//         vnpParams.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
//         vnpParams.put("vnp_IpAddr", getIpAddress(request));

//         // Thời gian tạo và hết hạn
//         Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
//         SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
//         String vnpCreateDate = formatter.format(cld.getTime());
//         vnpParams.put("vnp_CreateDate", vnpCreateDate);

//         cld.add(Calendar.MINUTE, 15);
//         String vnpExpireDate = formatter.format(cld.getTime());
//         vnpParams.put("vnp_ExpireDate", vnpExpireDate);

//         // Build query string và hash data
//         List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
//         Collections.sort(fieldNames);

//         StringBuilder hashData = new StringBuilder();
//         StringBuilder query = new StringBuilder();

//         Iterator<String> itr = fieldNames.iterator();
//         while (itr.hasNext()) {
//             String fieldName = itr.next();
//             String fieldValue = vnpParams.get(fieldName);
//             if (fieldValue != null && !fieldValue.isEmpty()) {
//                 // Build hash data
//                 hashData.append(fieldName);
//                 hashData.append('=');
//                 hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

//                 // Build query
//                 query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
//                 query.append('=');
//                 query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

//                 if (itr.hasNext()) {
//                     query.append('&');
//                     hashData.append('&');
//                 }
//             }
//         }

//         String queryUrl = query.toString();
//         String vnpSecureHash = vnPayConfig.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
//         queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
//         String paymentUrl = vnPayConfig.getPayUrl() + "?" + queryUrl;

//         log.info("Created payment URL for txnRef: {}", txnRef);

//         return PaymentResponse.builder()
//                 .code("00")
//                 .message("success")
//                 .paymentUrl(paymentUrl)
//                 .txnRef(txnRef)
//                 .build();
//     }
//     /**
//      * Xử lý IPN callback từ VNPay
//      */
//     @Transactional
//     public VNPayIpnResponse handleIpn(Map<String, String> params) {
//         try {
//             log.info("Received IPN callback with params: {}", params);

//             // Lấy secure hash
//             String vnpSecureHash = params.get("vnp_SecureHash");

//             // Remove hash params
//             params.remove("vnp_SecureHashType");
//             params.remove("vnp_SecureHash");

//             // Verify checksum
//             String signValue = hashAllFields(params);
//             if (!signValue.equals(vnpSecureHash)) {
//                 log.error("Invalid checksum");
//                 return VNPayIpnResponse.builder()
//                         .RspCode("97")
//                         .Message("Invalid Checksum")
//                         .build();
//             }

//             // Lấy thông tin giao dịch
//             String txnRef = params.get("vnp_TxnRef");
//             String responseCode = params.get("vnp_ResponseCode");
//             String transactionStatus = params.get("vnp_TransactionStatus");
//             String amountStr = params.get("vnp_Amount");

//             // Tìm order trong database
//             PaymentOrder order = paymentOrderRepository.findByTxnRef(txnRef)
//                     .orElse(null);

//             if (order == null) {
//                 log.error("Order not found: {}", txnRef);
//                 return VNPayIpnResponse.builder()
//                         .RspCode("01")
//                         .Message("Order not Found")
//                         .build();
//             }

//             // Kiểm tra số tiền
//             long vnpAmount = Long.parseLong(amountStr);
//             if (!order.getAmount().equals(vnpAmount)) {
//                 log.error("Invalid amount. Expected: {}, Received: {}", order.getAmount(), vnpAmount);
//                 return VNPayIpnResponse.builder()
//                         .RspCode("04")
//                         .Message("Invalid Amount")
//                         .build();
//             }

//             // Kiểm tra trạng thái order (chỉ cập nhật nếu đang PENDING hoặc PROCESSING)
//             if (order.getPaymentStatus() != PaymentStatus.PENDING && order.getPaymentStatus() != PaymentStatus.PROCESSING) {
//                 log.warn("Order already confirmed: {}", txnRef);
//                 return VNPayIpnResponse.builder()
//                         .RspCode("02")
//                         .Message("Order already confirmed")
//                         .build();
//             }

//             // Cập nhật thông tin giao dịch
//             order.setResponseCode(responseCode);
//             order.setTransactionStatus(transactionStatus);
//             order.setVnpayTransactionNo(params.get("vnp_TransactionNo"));
//             order.setBankCode(params.get("vnp_BankCode"));
//             order.setCardType(params.get("vnp_CardType"));

//             // Cập nhật trạng thái dựa trên response code
//             if ("00".equals(responseCode) && "00".equals(transactionStatus)) {
//                 order.setPaymentStatus(PaymentStatus.SUCCESS);
//                 order.setPaidAt(LocalDateTime.now());

//                 // Nâng cấp user lên CHEF nếu là order upgrade
//                 // if ("UPGRADE_CHEF".equals(order.getOrderType())) {
//                 //     upgradeUserToChef(order.getUser());
//                 // }

//                 log.info("Payment success for txnRef: {}", txnRef);
//             } else {
//                 order.setPaymentStatus(PaymentStatus.FAILED);
//                 log.info("Payment failed for txnRef: {}. ResponseCode: {}", txnRef, responseCode);
//             }

//             paymentOrderRepository.save(order);

//             return VNPayIpnResponse.builder()
//                     .RspCode("00")
//                     .Message("Confirm Success")
//                     .build();

//         } catch (Exception e) {
//             log.error("Error processing IPN", e);
//             return VNPayIpnResponse.builder()
//                     .RspCode("99")
//                     .Message("Unknown error")
//                     .build();
//         }
//     }

//     /**
//      * Nâng cấp user lên CHEF role
//      */
//     private void upgradeUserToChef(User user) {
//         RoleEntity chefRole = roleRepository.findByName("CHEF")
//                 .orElseThrow(() -> new RuntimeException("CHEF role not found"));

//         if (!user.getRoles().contains(chefRole)) {
//             user.getRoles().add(chefRole);
//             userRepository.save(user);
//             log.info("Upgraded user {} to CHEF", user.getId());
//         }
//     }

//     /**
//      * Generate unique transaction reference
//      */
//     private String generateUniqueTxnRef() {
//         String txnRef;
//         do {
//             txnRef = System.currentTimeMillis() + vnPayConfig.getRandomNumber(4);
//         } while (paymentOrderRepository.existsByTxnRef(txnRef));
//         return txnRef;
//     }

//     /**
//      * Hash all fields for checksum
//      */
//     private String hashAllFields(Map<String, String> fields) {
//         List<String> fieldNames = new ArrayList<>(fields.keySet());
//         Collections.sort(fieldNames);
//         StringBuilder sb = new StringBuilder();
//         Iterator<String> itr = fieldNames.iterator();
//         while (itr.hasNext()) {
//             String fieldName = itr.next();
//             String fieldValue = fields.get(fieldName);
//             if (fieldValue != null && !fieldValue.isEmpty()) {
//                 sb.append(fieldName);
//                 sb.append('=');
//                 sb.append(fieldValue);
//                 if (itr.hasNext()) {
//                     sb.append('&');
//                 }
//             }
//         }
//         return vnPayConfig.hmacSHA512(vnPayConfig.getHashSecret(), sb.toString());
//     }

//     /**
//      * Get client IP address
//      */
//     private String getIpAddress(HttpServletRequest request) {
//         String ipAddress = request.getHeader("X-FORWARDED-FOR");
//         if (ipAddress == null) {
//             ipAddress = request.getRemoteAddr();
//         }
//         return ipAddress;
//     }

//     // Hàm này phải được gọi khi cần xác nhận lại trạng thái giao dịch
//     public VnPayQuerydrResponse queryTransactionStatus(String txnRef, String transactionDate) {

//         String vnp_RequestId = vnPayConfig.getVnPayDateFormat();
//         String vnp_CreateDate = vnp_RequestId;

//         // 1. TẠO REQUEST OBJECT
//         VnPayQuerydrRequest requestBody = VnPayQuerydrRequest.builder()
//                 .vnp_RequestId(vnp_RequestId)
//                 .vnp_Version("2.1.0")
//                 .vnp_Command("querydr")
//                 .vnp_TmnCode(vnPayConfig.getTmnCode())
//                 .vnp_TxnRef(txnRef)
//                 .vnp_OrderInfo("Query transaction status for " + txnRef)
//                 .vnp_TransactionDate(transactionDate) // Thời gian giao dịch gốc
//                 .vnp_CreateDate(vnp_CreateDate) // Thời gian tạo request
//                 .vnp_IpAddr("127.0.0.1") // Địa chỉ IP của Server
//                 .build();

//         // 2. TẠO SECURE HASH cho QueryDR
//         // Quy tắc:
//         // vnp_RequestId|vnp_Version|vnp_Command|vnp_TmnCode|vnp_TxnRef|vnp_TransactionDate|vnp_CreateDate|vnp_IpAddr|vnp_OrderInfo

//         String hashRaw = String.join("|",
//                 requestBody.getVnp_RequestId(),
//                 requestBody.getVnp_Version(),
//                 requestBody.getVnp_Command(),
//                 requestBody.getVnp_TmnCode(),
//                 requestBody.getVnp_TxnRef(),
//                 requestBody.getVnp_TransactionDate(),
//                 requestBody.getVnp_CreateDate(),
//                 requestBody.getVnp_IpAddr(),
//                 requestBody.getVnp_OrderInfo());

//         String vnp_SecureHash = vnPayConfig.hmacSHA512(vnPayConfig.getHashSecret(), hashRaw);
//         requestBody.setVnp_SecureHash(vnp_SecureHash);

//         // 3. GỬI REQUEST POST/JSON
//         HttpHeaders headers = new HttpHeaders();
//         headers.setContentType(MediaType.APPLICATION_JSON);
//         HttpEntity<VnPayQuerydrRequest> entity = new HttpEntity<>(requestBody, headers);

//         try {
//             log.info("Sending QueryDR request for TxnRef: {}", txnRef);
//             // API URL: https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
//             VnPayQuerydrResponse response = restTemplate.postForObject(
//                     vnPayConfig.getApiTransactionUrl(),
//                     entity,
//                     VnPayQuerydrResponse.class);

//             // 4. KIỂM TRA SECURE HASH CỦA RESPONSE (BẮT BUỘC)
//             // (Bạn cần triển khai logic kiểm tra hash của response tại đây)
//             // Dựa trên tài liệu: data = vnp_ResponseId|vnp_Command|...
//             // Ví dụ: boolean isResponseHashValid = checkResponseHash(response);
//             if (!isQueryDrResponseHashValid(response, vnPayConfig.getHashSecret())) {
//                 // Nếu Hash không hợp lệ (hàm trả về false)
//                 return VnPayQuerydrResponse.builder()
//                         .vnp_ResponseCode("97") // Mã lỗi Hash không hợp lệ
//                         .vnp_Message("Hash phan hoi khong hop le (Response Checksum Failed)")
//                         .vnp_TransactionStatus("99")
//                         .build();
//             }

//             // Nếu Hash hợp lệ, tiếp tục xử lý
//             log.info("QueryDR Response Hash SUCCESS. Status: {}", response.getVnp_TransactionStatus());
//             log.info("QueryDR Response received. Status: {}", response.getVnp_TransactionStatus());
//             return response;

//         } catch (Exception e) {
//             log.error("Error calling VNPAY QueryDR API for TxnRef: {}", txnRef, e);
//             // Trả về đối tượng lỗi để hệ thống biết đã có lỗi xảy ra
//             return VnPayQuerydrResponse.builder()
//                     .vnp_ResponseCode("99")
//                     .vnp_Message("Lỗi hệ thống khi gọi QueryDR")
//                     .vnp_TransactionStatus("99")
//                     .build();
//         }
//     }

//     ///////////////////////////
//     public Map<String, Object> handleReturn(Map<String, String> params) {

//         // ... (Logic kiểm tra Secure Hash của Return URL PARAMS - Bắt buộc) ...
//         // 1. KIỂM TRA SECURE HASH CỦA RETURN URL (BẮT BUỘC theo tài liệu VNPAY)

//         // ----------------------------------------------------
//         // *** LOGIC TIẾP THEO SAU KHI ĐÃ XÁC MINH HASH ***
//         // ----------------------------------------------------
//         String vnp_ResponseCode = params.get("vnp_ResponseCode");
//         String txnRef = params.get("vnp_TxnRef");
//         String transactionDate = params.get("vnp_PayDate"); // Lấy thời gian thanh toán từ Return URL (hoặc
//                                                             // vnp_CreateDate nếu không có PayDate)
//         String amountStr = params.get("vnp_Amount");
//         // Giả định: Hash Return URL đã hợp lệ (hoặc bạn đã có logic kiểm tra ở lớp
//         // trên)
//         // **BƯỚC 1: KIỂM TRA TRẠNG THÁI HIỆN TẠI CỦA ĐƠN HÀNG TRONG DB**
//         // Giả sử bạn có hàm tìm kiếm trạng thái đơn hàng hiện tại
//         PaymentOrder paymentOrder = paymentOrderRepository.findByTxnRef(txnRef).orElse(null);
//         if (paymentOrder == null) {
//             log.error("PayOrder not found in RETURN URL handling: {}", txnRef);
//             return Map.of("RspCode", "01", "Message", "Don hang khong ton tai");
//         }

//         PaymentStatus currentDbStatus = paymentOrder.getPaymentStatus();
//         // Nếu đơn hàng đã ở trạng thái thành công (SUCCESS), thoát ngay lập tức
//         if (currentDbStatus == PaymentStatus.SUCCESS) {
//             log.warn("Order {} already processed successfully. No need for QueryDR.", txnRef);
//             return Map.of("RspCode", "00", "Message", "Thanh toan da duoc cap nhat truoc do.");
//         }

//         if ("00".equals(vnp_ResponseCode)) {
//             // Ngăn chặn gọi QueryDR nhiều lần nếu trạng thái đang là PROCESSING
//             if (currentDbStatus == PaymentStatus.PROCESSING) {
//                 // Có thể xem xét trả về trạng thái đang xử lý hoặc gọi QueryDR lần cuối (tùy
//                 // policy)
//                 // Tốt nhất là KHÔNG gọi lại để tránh lỗi Duplicate Request.
//                 log.warn("Order {} is still processing. Skipping QueryDR retry.", txnRef);
//                 return Map.of("RspCode", "99", "Message", "Don hang dang duoc xu ly, vui long doi.");
//             }

//             // Cập nhật tạm thời: Đặt trạng thái đơn hàng thành PROCESSING trong DB (để
//             // khóa)
//             updateOrderPaymentAndOrderStatus(txnRef, PaymentStatus.PROCESSING);
//             // Giao dịch thành công ban đầu -> Gọi QueryDR để xác nhận
//             VnPayQuerydrResponse querydrResponse = this.queryTransactionStatus(txnRef, transactionDate);

//             if ("00".equals(querydrResponse.getVnp_ResponseCode())
//                     && "00".equals(querydrResponse.getVnp_TransactionStatus())) {

//                 // Thành công cuối cùng: API Lookup thành công (00) VÀ Giao dịch thanh toán
//                 // thành công (00)
//                 log.info("Order {} confirmed SUCCESS via QueryDR.", txnRef);
//                 boolean ok = processPaymentResult( //cập nhật success ở đây
//                         txnRef,
//                         "00",
//                         "00",
//                         amountStr,
//                         params);

//                 if (!ok) {
//                     updateOrderPaymentAndOrderStatus(txnRef, PaymentStatus.PROCESSING);// Quay lại trạng thái PROCESSING nếu lỗi
//                     return Map.of("RspCode", "99", "Message", "Khong the cap nhat don hang");
//                 }

//                 return Map.of("RspCode", "00", "Message", "Thanh toan thanh cong");
//             } else {
//                 // Trạng thái không rõ ràng hoặc lỗi sau QueryDR
//                 updateOrderPaymentAndOrderStatus(txnRef, PaymentStatus.FAILED);
//                 log.warn("Order {} failed confirmation via QueryDR. Status: {}", txnRef,
//                         querydrResponse.getVnp_TransactionStatus());
//                 return Map.of("RspCode", "99", "Message", "Giao dich that bai: " + querydrResponse.getVnp_Message());
//             }
//         } else {
//             // Giao dịch thất bại ban đầu
//             log.warn("Order {} failed immediately. VNPAY Code: {}", txnRef, vnp_ResponseCode);
//             // updateOrderStatus(txnRef, "FAILED");
//             updateOrderPaymentAndOrderStatus(txnRef, PaymentStatus.FAILED);
//             return Map.of("RspCode", vnp_ResponseCode, "Message", "Giao dich that bai tai VNPAY");
//         }
//     }

//     ////////////
//     @Transactional
//     public boolean processPaymentResult(String txnRef,
//             String responseCode,
//             String transactionStatus,
//             String amountStr,
//             Map<String, String> params) {

//         long vnpAmount = Long.parseLong(amountStr);

//         PaymentOrder paymentOrder = paymentOrderRepository.findByTxnRef(txnRef).orElse(null);
//         if (paymentOrder == null) {
//             log.error("PaymentOrder not found: {}", txnRef);
//             return false;
//         }
//         Order order = paymentOrder.getOrder();
//         if (order == null) {
//             log.error("Order with payment not found: {}", paymentOrder.getId());
//             return false;
//         }

//         // Kiểm tra số tiền
//         if (!paymentOrder.getAmount().equals(vnpAmount)) {
//             log.error("Invalid amount for {}. Expected: {}, Received: {}", txnRef, paymentOrder.getAmount(), vnpAmount);
//             return false;
//         }

//         // Tránh update 2 lần (IMPORTANT cho future IPN)
//         if (paymentOrder.getPaymentStatus() != PaymentStatus.PENDING && paymentOrder.getPaymentStatus() != PaymentStatus.PROCESSING) {
//             log.warn("Order {} already processed.", txnRef);
//             return true;
//         }

//         // Ghi thông tin từ VNPay
//         paymentOrder.setResponseCode(responseCode);
//         paymentOrder.setTransactionStatus(transactionStatus);
//         paymentOrder.setVnpayTransactionNo(params.get("vnp_TransactionNo"));
//         paymentOrder.setBankCode(params.get("vnp_BankCode"));
//         paymentOrder.setCardType(params.get("vnp_CardType"));

//         // Update trạng thái
//         if ("00".equals(responseCode) && "00".equals(transactionStatus)) {
//             updateOrderPaymentAndOrderStatus(txnRef, PaymentStatus.SUCCESS);

//             paymentOrder.setPaidAt(LocalDateTime.now());
//             log.info("PaymentOrder upgrade {} marked as SUCCESS", txnRef);
//             if (Hibernate.getClass(order) == UpgradeOrder.class) {
//                 // Xử lý cho UpgradeOrder
//                 upgradeUserToChef(order.getBuyer());
//                 order.setOrderStatus(OrderStatus.COMPLETED);
//                 log.info("Order upgrade {} marked as COMPLETED", order.getId());
//             } else if (Hibernate.getClass(order) == DishOrder.class) {
//                 // Xử lý cho ProductOrder
//             }
            


//         } else {
//             updateOrderPaymentAndOrderStatus(txnRef, PaymentStatus.FAILED);
//             log.info("PaymenrOrder {} marked as FAILED", txnRef);
//         }

//         orderRepository.save(order);// save khi completed
//         paymentOrderRepository.save(paymentOrder);
//         return true;
//     }

//     /**
//      * Kiểm tra Secure Hash của phản hồi API QueryDR từ VNPAY.
//      * 
//      * @param response   Đối tượng VnPayQuerydrResponse nhận được từ VNPAY.
//      * @param hashSecret Khoá bí mật (Hash Secret) của Merchant.
//      * @return true nếu Hash hợp lệ, false nếu không hợp lệ hoặc thiếu hash.
//      */
//     private boolean isQueryDrResponseHashValid(VnPayQuerydrResponse response, String hashSecret) {
//         String receivedHash = response.getVnp_SecureHash();

//         if (receivedHash == null || receivedHash.isEmpty()) {
//             log.error("QueryDR Response missing Secure Hash for TxnRef: {}", response.getVnp_TxnRef());
//             return false;
//         }

//         // Quy tắc Hash: vnp_ResponseId|vnp_Command|... (15 trường cố định)
//         String hashRaw = String.join("|",
//                 // 1. vnp_ResponseId
//                 Objects.toString(response.getVnp_ResponseId(), ""),
//                 // 2. vnp_Command
//                 Objects.toString(response.getVnp_Command(), ""),
//                 // 3. vnp_ResponseCode
//                 Objects.toString(response.getVnp_ResponseCode(), ""),
//                 // 4. vnp_Message
//                 Objects.toString(response.getVnp_Message(), ""),
//                 // 5. vnp_TmnCode
//                 Objects.toString(response.getVnp_TmnCode(), ""),
//                 // 6. vnp_TxnRef
//                 Objects.toString(response.getVnp_TxnRef(), ""),
//                 // 7. vnp_Amount
//                 Objects.toString(response.getVnp_Amount(), ""),
//                 // 8. vnp_BankCode
//                 Objects.toString(response.getVnp_BankCode(), ""),
//                 // 9. vnp_PayDate
//                 Objects.toString(response.getVnp_PayDate(), ""),
//                 // 10. vnp_TransactionNo
//                 Objects.toString(response.getVnp_TransactionNo(), ""),
//                 // 11. vnp_TransactionType
//                 Objects.toString(response.getVnp_TransactionType(), ""),
//                 // 12. vnp_TransactionStatus
//                 Objects.toString(response.getVnp_TransactionStatus(), ""),
//                 // 13. vnp_OrderInfo
//                 Objects.toString(response.getVnp_OrderInfo(), ""),
//                 // 14. vnp_PromotionCode
//                 Objects.toString(response.getVnp_PromotionCode(), ""),
//                 // 15. vnp_PromotionAmount
//                 Objects.toString(response.getVnp_PromotionAmount(), ""));

//         // Tính toán Hash mới
//         String calculatedHash = vnPayConfig.hmacSHA512(hashSecret, hashRaw);

//         // So sánh (Không phân biệt chữ hoa/thường)
//         if (!calculatedHash.equalsIgnoreCase(receivedHash)) {
//             log.error("QueryDR Response Hash validation FAILED for TxnRef: {}. Calculated Hash: {}",
//                     response.getVnp_TxnRef(), calculatedHash);
//             return false;
//         }

//         return true;
//     }

//     /**
//      * Cập nhật trạng thái đơn hàng theo txnRef.
//      */
//     @Transactional
//     public void updateOrderPaymentAndOrderStatus(String txnRef, PaymentStatus newStatus) {
//         PaymentOrder paymentOrder = paymentOrderRepository.findByTxnRef(txnRef)
//                 .orElseThrow(() -> new IllegalArgumentException("Order not found: " + txnRef));
        
//         Order order = paymentOrder.getOrder();

//         PaymentStatus oldStatus = paymentOrder.getPaymentStatus();

//         // Idempotent: nếu trạng thái không đổi thì bỏ qua
//         if (oldStatus == newStatus) {
//             return;
//         }

//         // Không cho phép cập nhật SUCCESS -> trạng thái khác
//         if (oldStatus == PaymentStatus.SUCCESS && newStatus != PaymentStatus.SUCCESS) {
//             return;
//         }

//         // Chuyển trạng thái
//         paymentOrder.setPaymentStatus(newStatus);

//         if(order != null) {
//             if (newStatus == PaymentStatus.SUCCESS) {
//                 order.setOrderStatus(OrderStatus.PAID);
//             } else if (newStatus == PaymentStatus.FAILED) {
//                 order.setOrderStatus(OrderStatus.CANCELLED_BY_PAYMENT_FAIL);
//             }
//             orderRepository.save(order);
//         }

//         // Ghi thời gian thanh toán khi thành công lần đầu
//         if (newStatus == PaymentStatus.SUCCESS && paymentOrder.getPaidAt() == null) {
//             paymentOrder.setPaidAt(LocalDateTime.now());
//         }

//         paymentOrderRepository.save(paymentOrder);
//     }

//     // //////////////////// MAU
//     // /**
//     //  * Tạo URL thanh toán VNPay
//     //  */
//     // public PaymentResponse createPaymentTest(HttpServletRequest request, PaymentRequest paymentRequest, Long userId)
//     //         throws UnsupportedEncodingException {

//     //     // Lấy thông tin user
//     //     User user = userRepository.findById(userId)
//     //             .orElseThrow(() -> new RuntimeException("User not found"));

//     //     // Tạo mã giao dịch unique
//     //     String txnRef = generateUniqueTxnRef();

//     //     // Tính số tiền (nhân 100 để bỏ phần thập phân)
//     //     long amount = paymentRequest.getAmount() * 100;

//     //     // Tạo PaymentOrder
//     //     PaymentOrder paymentOrder = PaymentOrder.builder()
//     //             .user(user)
//     //             .orderType(paymentRequest.getOrderType())
//     //             .txnRef(txnRef)
//     //             .amount(amount)
//     //             .orderInfo(paymentRequest.getOrderInfo())
//     //             .paymentStatus(PaymentStatus.PENDING)
//     //             .build();

//     //     paymentOrderRepository.save(paymentOrder);

//     //     // Build VNPay payment parameters
//     //     Map<String, String> vnpParams = new HashMap<>();
//     //     vnpParams.put("vnp_Version", vnPayConfig.getVersion());
//     //     vnpParams.put("vnp_Command", vnPayConfig.getCommand());
//     //     vnpParams.put("vnp_TmnCode", vnPayConfig.getTmnCode());
//     //     vnpParams.put("vnp_Amount", String.valueOf(amount));
//     //     vnpParams.put("vnp_CurrCode", "VND");

//     //     if (paymentRequest.getBankCode() != null && !paymentRequest.getBankCode().isEmpty()) {
//     //         vnpParams.put("vnp_BankCode", paymentRequest.getBankCode());
//     //     }

//     //     vnpParams.put("vnp_TxnRef", txnRef);
//     //     vnpParams.put("vnp_OrderInfo", paymentRequest.getOrderInfo());
//     //     vnpParams.put("vnp_OrderType", vnPayConfig.getOrderType());

//     //     String locale = paymentRequest.getLanguage();
//     //     if (locale == null || locale.isEmpty()) {
//     //         locale = "vn";
//     //     }
//     //     vnpParams.put("vnp_Locale", locale);

//     //     vnpParams.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
//     //     vnpParams.put("vnp_IpAddr", getIpAddress(request));

//     //     // Thời gian tạo và hết hạn
//     //     Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
//     //     SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
//     //     String vnpCreateDate = formatter.format(cld.getTime());
//     //     vnpParams.put("vnp_CreateDate", vnpCreateDate);

//     //     cld.add(Calendar.MINUTE, 15);
//     //     String vnpExpireDate = formatter.format(cld.getTime());
//     //     vnpParams.put("vnp_ExpireDate", vnpExpireDate);

//     //     // Build query string và hash data
//     //     List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
//     //     Collections.sort(fieldNames);

//     //     StringBuilder hashData = new StringBuilder();
//     //     StringBuilder query = new StringBuilder();

//     //     Iterator<String> itr = fieldNames.iterator();
//     //     while (itr.hasNext()) {
//     //         String fieldName = itr.next();
//     //         String fieldValue = vnpParams.get(fieldName);
//     //         if (fieldValue != null && !fieldValue.isEmpty()) {
//     //             // Build hash data
//     //             hashData.append(fieldName);
//     //             hashData.append('=');
//     //             hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

//     //             // Build query
//     //             query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
//     //             query.append('=');
//     //             query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

//     //             if (itr.hasNext()) {
//     //                 query.append('&');
//     //                 hashData.append('&');
//     //             }
//     //         }
//     //     }

//     //     String queryUrl = query.toString();
//     //     String vnpSecureHash = vnPayConfig.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
//     //     queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
//     //     String paymentUrl = vnPayConfig.getPayUrl() + "?" + queryUrl;

//     //     log.info("Created payment URL for txnRef: {}", txnRef);

//     //     return PaymentResponse.builder()
//     //             .code("00")
//     //             .message("success")
//     //             .paymentUrl(paymentUrl)
//     //             .txnRef(txnRef)
//     //             .build();
//     // }
// }