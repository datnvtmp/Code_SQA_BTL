package com.example.cooking.controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cooking.service.CartCheckoutService;
import com.example.cooking.service.DishOrderService;
import com.example.cooking.service.PackageUpgradeService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.example.cooking.common.ApiResponse;
import com.example.cooking.dto.paymentDTO.PaymentResponse;
import com.example.cooking.dto.request.BuyNowRequest;
import com.example.cooking.model.PackageUpgrade;
import com.example.cooking.security.MyUserDetails;

import java.io.UnsupportedEncodingException;
import java.util.List;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
public class BuyController {

    private final PackageUpgradeService packageUpgradeService;
    private final DishOrderService dishOrderService;
    private final CartCheckoutService cartCheckoutService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PackageUpgrade>>> getAllPackages() {
        return ApiResponse.ok(packageUpgradeService.getAllPackages());
    }

    /**
     * API tạo payment để nâng cấp lên CHEF
     * Endpoint: POST /api/payment/upgrade-chef
     */
    @PostMapping("/packages/upgrade-chef")
    public ResponseEntity<ApiResponse<PaymentResponse>> upgradeToChef(
            HttpServletRequest request,
            @RequestParam Long packageId,
            @RequestParam(defaultValue = "VNBANK") String bankCode,
            @AuthenticationPrincipal MyUserDetails currentUser) {
        try {
            PaymentResponse paymentResponse = packageUpgradeService.createPaymentForPackage(request, packageId,
                    bankCode, currentUser);
            return ApiResponse.ok(paymentResponse);

        } catch (UnsupportedEncodingException e) {
            log.error("Error creating payment", e);
            return ApiResponse.custom(HttpStatus.BAD_REQUEST, "Error", PaymentResponse.builder()
                    .code("99")
                    .message("Error creating payment: " + e.getMessage())
                    .build());
        }
    }

    // /**
    //  * API tạo payment để mua món
    //  */

    // @PostMapping("/buy-now")
    // public ResponseEntity<ApiResponse<PaymentResponse>> buyNow(
    //         @AuthenticationPrincipal MyUserDetails currentUser,
    //         HttpServletRequest request,
    //         @Valid @RequestBody BuyNowRequest buyReq) {
    //     try {
    //         PaymentResponse paymentRes = dishOrderService.buyNow(request, buyReq, currentUser);

    //         return ApiResponse.ok(paymentRes);
            
    //     } catch (UnsupportedEncodingException e) {
    //         log.error("Error creating payment", e);
    //         return ApiResponse.custom(HttpStatus.BAD_REQUEST, "Error", PaymentResponse.builder()
    //                 .code("99")
    //                 .message("Error creating payment: " + e.getMessage())
    //                 .build());
    //     }
    // }
    

    @PostMapping("/checkout/cart/{cartId}/online-payment")
    public ResponseEntity<ApiResponse<PaymentResponse>> checkoutCart(
            @AuthenticationPrincipal MyUserDetails currentUser,
            HttpServletRequest request,
            @PathVariable Long cartId,
            @RequestParam Long addressId,
            @RequestParam(required = false) String shippingNote) {

        try {
            PaymentResponse paymentRes = cartCheckoutService.checkoutCart(
                    request, cartId, addressId, shippingNote, currentUser);

            return ApiResponse.ok(paymentRes);

        } catch (Exception e) {
            log.error("Error creating payment from cart", e);
            return ApiResponse.custom(
                    HttpStatus.BAD_REQUEST,
                    "Error",
                    PaymentResponse.builder()
                            .code("99")
                            .message("Error creating payment: " + e.getMessage())
                            .build()
            );
        }
    }


}
