package com.example.cooking.controller;

import com.example.cooking.dto.request.AddCartItemRequest;
import com.example.cooking.dto.request.UpdateCartItemRequest;
import com.example.cooking.common.ApiResponse;
import com.example.cooking.dto.CartDto;
import com.example.cooking.security.MyUserDetails;
import com.example.cooking.service.CartService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    /**
     * Thêm món vào cart ACTIVE theo seller
     */
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartDto>> addItem(
            @AuthenticationPrincipal MyUserDetails myUserDetails,
            @RequestBody AddCartItemRequest request) {
        return ApiResponse.ok(cartService.addItem(myUserDetails, request));
    }

    /**
     * Lấy tất cả cart ACTIVE của user
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<CartDto>>> getAllActiveCarts(@AuthenticationPrincipal MyUserDetails myUserDetails) {
        return  ApiResponse.ok(cartService.getAllActiveCarts(myUserDetails));
    }

    /**
     * Xóa món khỏi cart ACTIVE theo seller
     */
    @DeleteMapping("/remove/{cartId}/{dishId}")
    public ResponseEntity<ApiResponse<CartDto>> removeItem(
            @AuthenticationPrincipal MyUserDetails myUserDetails,
            @PathVariable Long cartId,
            @PathVariable Long dishId) {
        return  ApiResponse.ok(cartService.removeItem(myUserDetails, cartId, dishId));
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<ApiResponse<CartDto>> getCartBySeller(
            @AuthenticationPrincipal MyUserDetails myUserDetails,
            @PathVariable Long sellerId) {
        return  ApiResponse.ok(cartService.getCartBySeller(myUserDetails, sellerId));
    }
    
    @GetMapping("/{cartId}")
    public ResponseEntity<ApiResponse<CartDto>> getCartById(
            @AuthenticationPrincipal MyUserDetails myUserDetails,
            @PathVariable Long cartId) {
        return  ApiResponse.ok(cartService.getCartById(myUserDetails, cartId));
    }

    @PutMapping("/update-item/{cartId}")
    public ResponseEntity<ApiResponse<CartDto>> updateItemInCart(
            @AuthenticationPrincipal MyUserDetails myUserDetails,
            @PathVariable Long cartId,
            @RequestBody UpdateCartItemRequest updateCartItemRequest) {
        return  ApiResponse.ok(cartService.updateItemQuantity(myUserDetails, cartId, updateCartItemRequest));
    }

}
