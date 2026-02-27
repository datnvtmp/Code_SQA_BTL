package com.example.cooking.controller;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cooking.common.ApiResponse;
import com.example.cooking.common.PageDTO;
import com.example.cooking.common.enums.OrderStatus;
import com.example.cooking.dto.DishOrderDTO;
import com.example.cooking.dto.DishOrderDetailDTO;
import com.example.cooking.security.MyUserDetails;
import com.example.cooking.service.SellerOrderService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/seller/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CHEF')")
public class SellerOrderController {

    private final SellerOrderService sellerOrderService;

    @GetMapping("/paid")
    public ResponseEntity<ApiResponse<PageDTO<DishOrderDTO>>> getPaidOrders(
            @AuthenticationPrincipal MyUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
                Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.ok(sellerOrderService.getPaidOrders(userDetails.getId(), pageable));
    }

    @Operation(summary = "Lấy theo status, chỉ nhận paid, ship, deliver, complete, dùng để quản lý thống kê")
    @GetMapping
    public ResponseEntity<ApiResponse<PageDTO<DishOrderDTO>>> getOrdersByStatus(
            @AuthenticationPrincipal MyUserDetails userDetails,
            @RequestParam (required = true) OrderStatus orderStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
                Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.ok(sellerOrderService.getOrdersByStatus(userDetails.getId(), pageable, orderStatus));
    }

    @GetMapping("/detail/{orderId}")
    public ResponseEntity<ApiResponse<DishOrderDetailDTO>> getPaidOrderDetail(
            @AuthenticationPrincipal MyUserDetails userDetails,
            @PathVariable Long orderId) {
        return ApiResponse.ok(sellerOrderService.getOrderDetail(orderId,userDetails.getId()));
    }



    @PostMapping("/{orderId}/confirm")
    public ResponseEntity<ApiResponse<String>> confirmOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal MyUserDetails userDetails) {

        Long sellerId = userDetails.getId();

        sellerOrderService.confirmOrder(orderId, sellerId);
        return ApiResponse.ok("ok");
    }

    @PostMapping("/{orderId}/ship")
    public ResponseEntity<ApiResponse<String>> shipOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal MyUserDetails userDetails) {
        Long sellerId = userDetails.getId();

        sellerOrderService.shipOrder(orderId, sellerId);
        return ApiResponse.ok("ok");
    }
}

