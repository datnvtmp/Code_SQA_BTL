package com.example.cooking.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
import com.example.cooking.common.enums.OrderStatus;
import com.example.cooking.dto.DishOrderDTO;
import com.example.cooking.dto.DishOrderDetailDTO;
import com.example.cooking.security.MyUserDetails;
import com.example.cooking.service.BuyerOrderService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/buyer/orders")
@RequiredArgsConstructor
public class BuyerOrderController {

    private final BuyerOrderService buyerOrderService;

    @GetMapping("/paid")
    public ResponseEntity<ApiResponse<PageDTO<DishOrderDTO>>> getPaidOrders(
            @AuthenticationPrincipal MyUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
                Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.ok(buyerOrderService.getPaidOrders(userDetails.getId(), pageable));
    }

    @GetMapping("/shipped")
    public ResponseEntity<ApiResponse<PageDTO<DishOrderDTO>>> getShippedOrders(
            @AuthenticationPrincipal MyUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
                Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.ok(buyerOrderService.getShippedOrders(userDetails.getId(), pageable));
    }

    // @GetMapping("/unpaid")
    // public ResponseEntity<ApiResponse<PageDTO<DishOrderDTO>>> getUnpaidOrders(
    //         @AuthenticationPrincipal MyUserDetails userDetails,
    //         @RequestParam(defaultValue = "0") int page,
    //         @RequestParam(defaultValue = "10") int size) {
    //             Pageable pageable = PageRequest.of(page, size);
    //     return ApiResponse.ok(buyerOrderService.getWatingPaidOrders(userDetails.getId(), pageable));
    // }

    @Operation(summary = "Nhận vào orderstatus, thiếu cái api nào thì vô đây gọi")
    @GetMapping
    public ResponseEntity<ApiResponse<PageDTO<DishOrderDTO>>> getOrdersByStatus(
            @AuthenticationPrincipal MyUserDetails userDetails,
            @RequestParam(required = true) OrderStatus orderStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
                Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.ok(buyerOrderService.getOrdersByStatus(userDetails.getId(), pageable, orderStatus));
    }


    @GetMapping("/detail/{orderId}")
    public ResponseEntity<ApiResponse<DishOrderDetailDTO>> getPaidOrderDetail(
            @AuthenticationPrincipal MyUserDetails userDetails,
            @PathVariable Long orderId) {
        return ApiResponse.ok(buyerOrderService.getOrderDetail(orderId,userDetails.getId()));
    }
    

    @Operation(summary = "Xác nhận đã giao")
    @PutMapping("/{orderId}/deliver")
    public ResponseEntity<?> confirmDelivered(
            @PathVariable Long orderId,
            @AuthenticationPrincipal MyUserDetails currentUser
    ) {
        buyerOrderService.confirmDelivered(orderId, currentUser);
        return ApiResponse.ok("ok");
    }

    @Operation(summary = "Xác nhận hoàn tất (+ tiền cho bên bán + không khiếu nại lại)")
    @PutMapping("/{orderId}/complete")
    public ResponseEntity<?> confirmComplete(
            @PathVariable Long orderId,
            @AuthenticationPrincipal MyUserDetails currentUser
    ) {
        buyerOrderService.confirmComplete(orderId, currentUser);
        return ApiResponse.ok("ok");
    }


    // @Operation(summary = "Hủy đơn (chỉ đơn chưa thanh toán)")
    // @PutMapping("/{orderId}/cancel")
    // public ResponseEntity<?> cancelOrder(
    //         @PathVariable Long orderId,
    //         @AuthenticationPrincipal MyUserDetails currentUser
    // ) {
    //     buyerOrderService.cancelOrder(orderId, currentUser);
    //     return ApiResponse.ok("ok");
    // }
}

