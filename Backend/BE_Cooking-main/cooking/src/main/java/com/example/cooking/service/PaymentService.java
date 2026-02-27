package com.example.cooking.service;

import com.example.cooking.common.enums.OrderStatus;
import com.example.cooking.common.enums.PaymentStatus;
import com.example.cooking.config.VNPayConfig;
import com.example.cooking.dto.paymentDTO.PaymentRequest;
import com.example.cooking.dto.paymentDTO.PaymentResponse;
import com.example.cooking.dto.paymentDTO.VNPayIpnResponse;
import com.example.cooking.dto.paymentDTO.VnPayQuerydrRequest;
import com.example.cooking.dto.paymentDTO.VnPayQuerydrResponse;
import com.example.cooking.exception.CustomException;
import com.example.cooking.model.Order;
import com.example.cooking.model.PaymentOrder;
import com.example.cooking.model.Dish;
import com.example.cooking.model.DishOrder;
import com.example.cooking.model.DishOrderItem;
import com.example.cooking.model.RoleEntity;
import com.example.cooking.model.UpgradeOrder;
import com.example.cooking.model.User;
import com.example.cooking.repository.DishOrderRepository;
import com.example.cooking.repository.DishRepository;
import com.example.cooking.repository.OrderRepository;
import com.example.cooking.repository.PaymentOrderRepository;
import com.example.cooking.repository.RoleRepository;
import com.example.cooking.repository.UpgradeOrderRepository;
import com.example.cooking.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final VNPayConfig vnPayConfig;
    private final PaymentOrderRepository paymentOrderRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DishRepository dishRepository;
    private final DishService dishService;
    private final UpgradeOrderRepository upgradeOrderRepository;
    private final DishOrderRepository dishOrderRepository;
    private final SellerWalletService sellerWalletService;
    // new
    private final RestTemplate restTemplate;

    /**
     * Tạo URL thanh toán VNPay
     */
    public PaymentResponse createPayment(HttpServletRequest request, PaymentRequest paymentRequest)
            throws UnsupportedEncodingException {

        // Tạo mã giao dịch unique
        String txnRef = generateUniqueTxnRef();

        // Tính số tiền (nhân 100 để bỏ phần thập phân)
        long amount = paymentRequest.getAmount() * 100;
        // Tạo PaymentOrder
        PaymentOrder paymentOrder = PaymentOrder.builder()
                .order(paymentRequest.getOrder())
                .txnRef(txnRef)
                .amount(amount/100)
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        paymentOrderRepository.save(paymentOrder);

        // Build VNPay payment parameters
        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", vnPayConfig.getVersion());
        vnpParams.put("vnp_Command", vnPayConfig.getCommand());
        vnpParams.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(amount));
        vnpParams.put("vnp_CurrCode", "VND");

        if (paymentRequest.getBankCode() != null && !paymentRequest.getBankCode().isEmpty()) {
            vnpParams.put("vnp_BankCode", paymentRequest.getBankCode());
        }

        vnpParams.put("vnp_TxnRef", txnRef);
        vnpParams.put("vnp_OrderInfo", paymentRequest.getOrder().getOrderInfo());
        vnpParams.put("vnp_OrderType", vnPayConfig.getOrderType());

        String locale = paymentRequest.getLanguage();
        if (locale == null || locale.isEmpty()) {
            locale = "vn";
        }
        vnpParams.put("vnp_Locale", locale);

        vnpParams.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnpParams.put("vnp_IpAddr", getIpAddress(request));

        // Thời gian tạo và hết hạn
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnpCreateDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_CreateDate", vnpCreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnpExpireDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_ExpireDate", vnpExpireDate);

        // Build query string và hash data
        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnpParams.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        String vnpSecureHash = vnPayConfig.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = vnPayConfig.getPayUrl() + "?" + queryUrl;

        log.info("Created payment URL for txnRef: {}", txnRef);

        return PaymentResponse.builder()
                .code("00")
                .message("success")
                .paymentUrl(paymentUrl)
                .txnRef(txnRef)
                .build();
    }

    /**
     * Xử lý IPN callback từ VNPay
     */
    @Transactional
    public VNPayIpnResponse handleIpn(Map<String, String> params) {
        try {
            log.info("Received IPN callback with params: {}", params);

            // Lấy secure hash
            String vnpSecureHash = params.get("vnp_SecureHash");

            // Remove hash params
            params.remove("vnp_SecureHashType");
            params.remove("vnp_SecureHash");

            // Verify checksum
            String signValue = hashAllFields(params);
            if (!signValue.equals(vnpSecureHash)) {
                log.error("Invalid checksum");
                return VNPayIpnResponse.builder()
                        .RspCode("97")
                        .Message("Invalid Checksum")
                        .build();
            }

            // Lấy thông tin giao dịch
            String txnRef = params.get("vnp_TxnRef");
            String responseCode = params.get("vnp_ResponseCode");
            String transactionStatus = params.get("vnp_TransactionStatus");
            String amountStr = params.get("vnp_Amount");

            // Tìm order trong database
            PaymentOrder order = paymentOrderRepository.findByTxnRef(txnRef)
                    .orElse(null);

            if (order == null) {
                log.error("Order not found: {}", txnRef);
                return VNPayIpnResponse.builder()
                        .RspCode("01")
                        .Message("Order not Found")
                        .build();
            }

            // Kiểm tra số tiền
            long vnpAmount = Long.parseLong(amountStr);
            if (!order.getAmount().equals(vnpAmount)) {
                log.error("Invalid amount. Expected: {}, Received: {}", order.getAmount(), vnpAmount);
                return VNPayIpnResponse.builder()
                        .RspCode("04")
                        .Message("Invalid Amount")
                        .build();
            }

            // Kiểm tra trạng thái order (chỉ cập nhật nếu đang PENDING hoặc PROCESSING)
            if (order.getPaymentStatus() != PaymentStatus.PENDING
                    && order.getPaymentStatus() != PaymentStatus.PROCESSING) {
                log.warn("Order already confirmed: {}", txnRef);
                return VNPayIpnResponse.builder()
                        .RspCode("02")
                        .Message("Order already confirmed")
                        .build();
            }

            // Cập nhật thông tin giao dịch
            order.setResponseCode(responseCode);
            order.setTransactionStatus(transactionStatus);
            order.setVnpayTransactionNo(params.get("vnp_TransactionNo"));
            order.setBankCode(params.get("vnp_BankCode"));
            order.setCardType(params.get("vnp_CardType"));

            // Cập nhật trạng thái dựa trên response code
            if ("00".equals(responseCode) && "00".equals(transactionStatus)) {
                order.setPaymentStatus(PaymentStatus.SUCCESS);
                order.setPaidAt(LocalDateTime.now());

                // Nâng cấp user lên CHEF nếu là order upgrade
                // if ("UPGRADE_CHEF".equals(order.getOrderType())) {
                // upgradeUserToChef(order.getUser());
                // }

                log.info("Payment success for txnRef: {}", txnRef);
            } else {
                order.setPaymentStatus(PaymentStatus.FAILED);
                log.info("Payment failed for txnRef: {}. ResponseCode: {}", txnRef, responseCode);
            }

            paymentOrderRepository.save(order);

            return VNPayIpnResponse.builder()
                    .RspCode("00")
                    .Message("Confirm Success")
                    .build();

        } catch (Exception e) {
            log.error("Error processing IPN", e);
            return VNPayIpnResponse.builder()
                    .RspCode("99")
                    .Message("Unknown error")
                    .build();
        }
    }

    /**
     * Nâng cấp user lên CHEF role
     */
    private void upgradeUserToChef(User user) {
        RoleEntity chefRole = roleRepository.findByName("CHEF")
                .orElseThrow(() -> new RuntimeException("CHEF role not found"));

        if (!user.getRoles().contains(chefRole)) {
            user.getRoles().add(chefRole);
            userRepository.save(user);
            log.info("Upgraded user {} to CHEF", user.getId());
        }
    }

    /**
     * Generate unique transaction reference
     */
    private String generateUniqueTxnRef() {
        String txnRef;
        do {
            txnRef = System.currentTimeMillis() + vnPayConfig.getRandomNumber(4);
        } while (paymentOrderRepository.existsByTxnRef(txnRef));
        return txnRef;
    }

    /**
     * Hash all fields for checksum
     */
    private String hashAllFields(Map<String, String> fields) {
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                sb.append(fieldName);
                sb.append('=');
                sb.append(fieldValue);
                if (itr.hasNext()) {
                    sb.append('&');
                }
            }
        }
        return vnPayConfig.hmacSHA512(vnPayConfig.getHashSecret(), sb.toString());
    }

    /**
     * Get client IP address
     */
    private String getIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-FORWARDED-FOR");
        if (ipAddress == null) {
            ipAddress = request.getRemoteAddr();
        }
        return ipAddress;
    }

    // Hàm này phải được gọi khi cần xác nhận lại trạng thái giao dịch
    public VnPayQuerydrResponse queryTransactionStatus(String txnRef, String transactionDate) {

        String vnp_RequestId = vnPayConfig.getVnPayDateFormat();
        String vnp_CreateDate = vnp_RequestId;

        // 1. TẠO REQUEST OBJECT
        VnPayQuerydrRequest requestBody = VnPayQuerydrRequest.builder()
                .vnp_RequestId(vnp_RequestId)
                .vnp_Version("2.1.0")
                .vnp_Command("querydr")
                .vnp_TmnCode(vnPayConfig.getTmnCode())
                .vnp_TxnRef(txnRef)
                .vnp_OrderInfo("Query transaction status for " + txnRef)
                .vnp_TransactionDate(transactionDate) // Thời gian giao dịch gốc
                .vnp_CreateDate(vnp_CreateDate) // Thời gian tạo request
                .vnp_IpAddr("127.0.0.1") // Địa chỉ IP của Server
                .build();

        // 2. TẠO SECURE HASH cho QueryDR
        // Quy tắc:
        // vnp_RequestId|vnp_Version|vnp_Command|vnp_TmnCode|vnp_TxnRef|vnp_TransactionDate|vnp_CreateDate|vnp_IpAddr|vnp_OrderInfo

        String hashRaw = String.join("|",
                requestBody.getVnp_RequestId(),
                requestBody.getVnp_Version(),
                requestBody.getVnp_Command(),
                requestBody.getVnp_TmnCode(),
                requestBody.getVnp_TxnRef(),
                requestBody.getVnp_TransactionDate(),
                requestBody.getVnp_CreateDate(),
                requestBody.getVnp_IpAddr(),
                requestBody.getVnp_OrderInfo());

        String vnp_SecureHash = vnPayConfig.hmacSHA512(vnPayConfig.getHashSecret(), hashRaw);
        requestBody.setVnp_SecureHash(vnp_SecureHash);

        // 3. GỬI REQUEST POST/JSON
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<VnPayQuerydrRequest> entity = new HttpEntity<>(requestBody, headers);

        try {
            log.info("Sending QueryDR request for TxnRef: {}", txnRef);
            // API URL: https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
            VnPayQuerydrResponse response = restTemplate.postForObject(
                    vnPayConfig.getApiTransactionUrl(),
                    entity,
                    VnPayQuerydrResponse.class);
                    System.out.println(response);

            // 4. KIỂM TRA SECURE HASH CỦA RESPONSE (BẮT BUỘC)
            // (Bạn cần triển khai logic kiểm tra hash của response tại đây)
            // Dựa trên tài liệu: data = vnp_ResponseId|vnp_Command|...
            // Ví dụ: boolean isResponseHashValid = checkResponseHash(response);
            if (!isQueryDrResponseHashValid(response, vnPayConfig.getHashSecret())) {
                // Nếu Hash không hợp lệ (hàm trả về false)
                return VnPayQuerydrResponse.builder()
                        .vnp_ResponseCode("97") // Mã lỗi Hash không hợp lệ
                        .vnp_Message("Hash phan hoi khong hop le (Response Checksum Failed)")
                        .vnp_TransactionStatus("99")
                        .build();
            }

            // Nếu Hash hợp lệ, tiếp tục xử lý
            log.info("QueryDR Response Hash SUCCESS. Status: {}", response.getVnp_TransactionStatus());
            log.info("QueryDR Response received. Status: {}", response.getVnp_TransactionStatus());
            return response;

        } catch (Exception e) {
            log.error("Error calling VNPAY QueryDR API for TxnRef: {}", txnRef, e);
            // Trả về đối tượng lỗi để hệ thống biết đã có lỗi xảy ra
            return VnPayQuerydrResponse.builder()
                    .vnp_ResponseCode("99")
                    .vnp_Message("Lỗi hệ thống khi gọi QueryDR")
                    .vnp_TransactionStatus("99")
                    .build();
        }
    }

    ///////////////////////////
    public Map<String, Object> handleReturn(Map<String, String> params) {

        // TODO: kiểm tra hash
        String txnRef = params.get("vnp_TxnRef");
        // String responseCode = params.get("vnp_ResponseCode");
        // String amountStr = params.get("vnp_Amount");
        String transactionDate = params.get("vnp_PayDate");

        PaymentOrder paymentOrder = paymentOrderRepository.findByTxnRef(txnRef)
                .orElse(null);

        if (paymentOrder == null) {
            return Map.of("RspCode", "01", "Message", "Order not found");
        }

        // Idempotent
        if (paymentOrder.getPaymentStatus() == PaymentStatus.SUCCESS) {
            return Map.of("RspCode", "00", "Message", "Already processed");
        }

        VnPayQuerydrResponse querydr = queryTransactionStatus(txnRef, transactionDate);
        Long querydrAmount = querydr.getVnp_Amount()/100; // Lấy từ QueryDR
        log.info("SO TIENnnnnnnnnnnnnnnnnnnnnnnn");
        System.out.println(querydrAmount);

        if (!"00".equals(querydr.getVnp_ResponseCode())
                || !"00".equals(querydr.getVnp_TransactionStatus())) {
            processPaymentResult(
                    txnRef,
                    querydr.getVnp_ResponseCode(),
                    querydr.getVnp_TransactionStatus(),
                    querydrAmount,
                    params);
            return Map.of("RspCode", "99", "Message", "QueryDR failed");
        }

        // DUY NHẤT 1 CHỖ XỬ LÝ CUỐI
        boolean ok = processPaymentResult(
                txnRef,
                "00",
                "00",
                querydrAmount,
                params);

        if (!ok) {
            return Map.of("RspCode", "99", "Message", "Process failed");
        }

        return Map.of("RspCode", "00", "Message", "Payment success");
    }

    ////////////
    @Transactional(rollbackFor = Exception.class)
    public boolean processPaymentResult(
            String txnRef,
            String responseCode,
            String transactionStatus,
            Long vnpAmount,
            Map<String, String> params) {

        PaymentOrder paymentOrder = paymentOrderRepository.findByTxnRef(txnRef)
                .orElseThrow();

        // Idempotent
        if (paymentOrder.getPaymentStatus() == PaymentStatus.SUCCESS) {
            return true;
        }

        if (!paymentOrder.getAmount().equals(vnpAmount)) {
            System.out.println(paymentOrder.getAmount());
            System.out.println(vnpAmount);
            return false;
        }

        Order order = paymentOrder.getOrder();
        if (order == null) {
            return false;
        }
        order = orderRepository.findById(order.getId()).orElseThrow(() ->new CustomException("Khong thay order"));
        // Ghi log VNPay
        paymentOrder.setResponseCode(responseCode);
        paymentOrder.setTransactionStatus(transactionStatus);
        paymentOrder.setVnpayTransactionNo(params.get("vnp_TransactionNo"));
        paymentOrder.setBankCode(params.get("vnp_BankCode"));
        paymentOrder.setCardType(params.get("vnp_CardType"));

        if (!"00".equals(responseCode) || !"00".equals(transactionStatus)) {
            updatePaymentStatus(txnRef, PaymentStatus.FAILED);
            order.setOrderStatus(OrderStatus.CANCELLED_BY_PAYMENT_FAIL);
            orderRepository.save(order);
            return true;
        }
System.out.println("Hit3");
        // ==== PHẦN QUAN TRỌNG ====
        // ===thanh toán dish=====
        if (order.getOrderType().equals("PURCHASE_PRODUCT")) {
            DishOrder dishOrder = dishOrderRepository.findById(order.getId())
                                     .orElseThrow(()-> new CustomException("Khong thay dish order"));
            decreaseDishServingsWithVersion(dishOrder);
            System.out.println("Hit2");
            order.setOrderStatus(OrderStatus.PAID);  
            sellerWalletService.addOrderRevenue(order.getSeller().getId(), order.getTotalAmount(), order.getId());
        }
        
        // ===============Thanh toán upgrade========================
        
        if (order.getOrderType().equals("UPGRADE_CHEF")) {
            UpgradeOrder upgradeOrder = upgradeOrderRepository.findById(order.getId())
                                        .orElseThrow(()-> new CustomException("Khong thay upgrade order"));
            upgradeUserToChef(upgradeOrder.getBuyer());
            order.setOrderStatus(OrderStatus.COMPLETED);
            //tạo ví
            sellerWalletService.createWallet(order.getBuyer());
        }
        paymentOrder.setPaidAt(LocalDateTime.now());
        paymentOrder.setPaymentStatus(PaymentStatus.SUCCESS);
        orderRepository.save(order);
        paymentOrderRepository.save(paymentOrder);

        return true;
    }

    /**
     * Kiểm tra Secure Hash của phản hồi API QueryDR từ VNPAY.
     * 
     * @param response   Đối tượng VnPayQuerydrResponse nhận được từ VNPAY.
     * @param hashSecret Khoá bí mật (Hash Secret) của Merchant.
     * @return true nếu Hash hợp lệ, false nếu không hợp lệ hoặc thiếu hash.
     */
    private boolean isQueryDrResponseHashValid(VnPayQuerydrResponse response, String hashSecret) {
        String receivedHash = response.getVnp_SecureHash();

        if (receivedHash == null || receivedHash.isEmpty()) {
            log.error("QueryDR Response missing Secure Hash for TxnRef: {}", response.getVnp_TxnRef());
            return false;
        }

        // Quy tắc Hash: vnp_ResponseId|vnp_Command|... (15 trường cố định)
        String hashRaw = String.join("|",
                // 1. vnp_ResponseId
                Objects.toString(response.getVnp_ResponseId(), ""),
                // 2. vnp_Command
                Objects.toString(response.getVnp_Command(), ""),
                // 3. vnp_ResponseCode
                Objects.toString(response.getVnp_ResponseCode(), ""),
                // 4. vnp_Message
                Objects.toString(response.getVnp_Message(), ""),
                // 5. vnp_TmnCode
                Objects.toString(response.getVnp_TmnCode(), ""),
                // 6. vnp_TxnRef
                Objects.toString(response.getVnp_TxnRef(), ""),
                // 7. vnp_Amount
                Objects.toString(response.getVnp_Amount(), ""),
                // 8. vnp_BankCode
                Objects.toString(response.getVnp_BankCode(), ""),
                // 9. vnp_PayDate
                Objects.toString(response.getVnp_PayDate(), ""),
                // 10. vnp_TransactionNo
                Objects.toString(response.getVnp_TransactionNo(), ""),
                // 11. vnp_TransactionType
                Objects.toString(response.getVnp_TransactionType(), ""),
                // 12. vnp_TransactionStatus
                Objects.toString(response.getVnp_TransactionStatus(), ""),
                // 13. vnp_OrderInfo
                Objects.toString(response.getVnp_OrderInfo(), ""),
                // 14. vnp_PromotionCode
                Objects.toString(response.getVnp_PromotionCode(), ""),
                // 15. vnp_PromotionAmount
                Objects.toString(response.getVnp_PromotionAmount(), ""));

        // Tính toán Hash mới
        String calculatedHash = vnPayConfig.hmacSHA512(hashSecret, hashRaw);

        // So sánh (Không phân biệt chữ hoa/thường)
        if (!calculatedHash.equalsIgnoreCase(receivedHash)) {
            log.error("QueryDR Response Hash validation FAILED for TxnRef: {}. Calculated Hash: {}",
                    response.getVnp_TxnRef(), calculatedHash);
            return false;
        }

        return true;
    }

    /**
     * Cập nhật trạng thái đơn hàng theo txnRef.
     */
    @Transactional
    public void updatePaymentStatus(String txnRef, PaymentStatus newStatus) {
        PaymentOrder paymentOrder = paymentOrderRepository.findByTxnRef(txnRef)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + txnRef));
        PaymentStatus oldStatus = paymentOrder.getPaymentStatus();
        // Idempotent: nếu trạng thái không đổi thì bỏ qua
        if (oldStatus == newStatus) {
            return;
        }
        // Không cho phép cập nhật SUCCESS -> trạng thái khác
        if (oldStatus == PaymentStatus.SUCCESS && newStatus != PaymentStatus.SUCCESS) {
            return;
        }
        // Chuyển trạng thái
        paymentOrder.setPaymentStatus(newStatus);
        // Ghi thời gian thanh toán khi thành công lần đầu
        if (newStatus == PaymentStatus.SUCCESS && paymentOrder.getPaidAt() == null) {
            paymentOrder.setPaidAt(LocalDateTime.now());
        }
        paymentOrderRepository.save(paymentOrder);
    }

    private void decreaseDishServingsWithVersion(DishOrder order) {

        for (DishOrderItem item : order.getItems()) {

            Dish dish = dishRepository.findById(item.getDish().getId())
                    .orElseThrow(() -> new CustomException("Dish not found"));

            if (dish.getRemainingServings() < item.getQuantity()) {
                throw new CustomException("Not enough servings for dish " + dish.getId());
            }

            dish.setRemainingServings(
                    dish.getRemainingServings() - item.getQuantity());

            dishService.syncStatusWithRemaining(dish);
            // KHÔNG cần save(), JPA dirty checking + @Version
        }
    }

}