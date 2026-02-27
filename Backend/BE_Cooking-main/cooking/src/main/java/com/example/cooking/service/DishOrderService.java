package com.example.cooking.service;

import java.io.UnsupportedEncodingException;
import java.util.List;

import org.springframework.security.access.method.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.cooking.common.enums.OrderStatus;
import com.example.cooking.dto.paymentDTO.PaymentRequest;
import com.example.cooking.dto.paymentDTO.PaymentResponse;
import com.example.cooking.dto.request.BuyNowRequest;
import com.example.cooking.exception.CustomException;
import com.example.cooking.model.Address;
import com.example.cooking.model.Dish;
import com.example.cooking.model.DishOrder;
import com.example.cooking.model.DishOrderItem;
import com.example.cooking.model.User;
import com.example.cooking.repository.AddressRepository;
import com.example.cooking.repository.DishOrderItemRepository;
import com.example.cooking.repository.DishOrderRepository;
import com.example.cooking.repository.DishRepository;
import com.example.cooking.repository.PaymentOrderRepository;
import com.example.cooking.repository.UserRepository;
import com.example.cooking.security.MyUserDetails;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

// src/main/java/com/example/cooking/service/order/DishOrderService.java
@Service
@RequiredArgsConstructor
@Transactional
public class DishOrderService {

    private final DishRepository dishRepository;
    private final UserRepository userRepository;
    private final DishOrderRepository dishOrderRepository;
    private final DishOrderItemRepository dishOrderItemRepository;
    // private final PaymentOrderRepository paymentOrderRepository;
    private final PaymentService paymentService;
    private final AddressRepository addressRepository;

    // Bạn cần lấy user hiện tại từ SecurityContext
    private User getCurrentUser(MyUserDetails currentUser) {
        return userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new CustomException("User not found"));
    }

    public PaymentResponse buyNow(HttpServletRequest request, BuyNowRequest buyReq, MyUserDetails currentUser) throws UnsupportedEncodingException {
        User buyer = getCurrentUser(currentUser);

        Dish dish = dishRepository.findById(buyReq.getDishId())
                .orElseThrow(() -> new CustomException("Dish not found with id: " + buyReq.getDishId()));

        if (dish.getPrice() == null || dish.getPrice() <= 0) {
            throw new CustomException("Dish price is invalid for dish id: " + buyReq.getDishId());
        }

        long totalAmount = dish.getPrice() * buyReq.getQuantity();

        Address address = addressRepository.findById(buyReq.getAddressId())
                .orElseThrow(() -> new CustomException("Address not found"));

        if (!address.getUser().getId().equals(buyer.getId())) {
                throw new RuntimeException("Address does not belong to user");
        }
        // 1. Tạo DishOrder (kế thừa Order)
        DishOrder dishOrder = DishOrder.builder()
                .buyer(buyer)
                .seller(dish.getRecipe() != null ? dish.getRecipe().getUser() : null) // chef là người tạo recipe
                .orderStatus(OrderStatus.WAITING_PAYMENT)
                .totalAmount(totalAmount)
                .orderInfo("Mua món: " + dish.getName() + " x" + buyReq.getQuantity())
                .address(address)
                .shippingNote(buyReq.getShippingNote())
                .build();

        dishOrderRepository.save(dishOrder);

        // 2. Tạo DishOrderItem
        DishOrderItem item = DishOrderItem.builder()
                .dishOrder(dishOrder)
                .dish(dish)
                .quantity(buyReq.getQuantity())
                .priceAtOrder(dish.getPrice())
                .build();

        dishOrderItemRepository.save(item);

        // Gán lại list items để Hibernate nhận diện (nếu cần)
        dishOrder.setItems(List.of(item));

        // 3. Tạo request thanh toán VNPay
        PaymentRequest paymentRequest = PaymentRequest.builder()
                .order(dishOrder) // truyền nguyên DishOrder (là subclass của Order)
                .amount(totalAmount)
                .bankCode(buyReq.getBankCode()!= null ? buyReq.getBankCode() : "VNBANK")
                .language(buyReq.getLanguage() != null ? buyReq.getLanguage() : "vn")
                .build();

        // 4. Gọi hàm tạo URL thanh toán bạn đã có sẵn
        return paymentService.createPayment(request, paymentRequest);
    }
}