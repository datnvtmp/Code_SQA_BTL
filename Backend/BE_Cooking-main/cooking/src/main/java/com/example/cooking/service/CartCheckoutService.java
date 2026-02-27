package com.example.cooking.service;

import java.io.UnsupportedEncodingException;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.cooking.common.enums.CartStatus;
import com.example.cooking.common.enums.DishStatus;
import com.example.cooking.common.enums.OrderStatus;
import com.example.cooking.dto.paymentDTO.PaymentRequest;
import com.example.cooking.dto.paymentDTO.PaymentResponse;
import com.example.cooking.model.Address;
import com.example.cooking.model.Cart;
import com.example.cooking.model.Dish;
import com.example.cooking.model.DishOrder;
import com.example.cooking.model.DishOrderItem;
import com.example.cooking.model.User;
import com.example.cooking.repository.AddressRepository;
import com.example.cooking.repository.CartRepository;
import com.example.cooking.repository.DishOrderItemRepository;
import com.example.cooking.repository.DishOrderRepository;
import com.example.cooking.repository.UserRepository;
import com.example.cooking.security.MyUserDetails;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CartCheckoutService {

        private final CartRepository cartRepository;
        private final DishOrderRepository dishOrderRepository;
        private final DishOrderItemRepository dishOrderItemRepository;
        private final UserRepository userRepository;
        private final PaymentService paymentService;
        private final AddressRepository addressRepository;

        public PaymentResponse checkoutCart(HttpServletRequest request, Long cartId, Long addressId,
                        String shippingNote, MyUserDetails currentUser) throws UnsupportedEncodingException {
                User buyer = userRepository.findById(currentUser.getId())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // 1. Lấy ACTIVE cart của user cho seller
                Cart cart = cartRepository.findByIdAndUserIdAndStatus(cartId, currentUser.getId(), CartStatus.ACTIVE)
                                .orElseThrow(() -> new RuntimeException("Cart not found"));

                if (cart.getItems().isEmpty()) {
                        throw new RuntimeException("Cart is empty");
                }

                // 2. Lấy địa chỉ giao hàng
                Address address = addressRepository.findById(addressId)
                                .orElseThrow(() -> new RuntimeException("Address not found"));

                if (!address.getUser().getId().equals(buyer.getId())) {
                        throw new RuntimeException("Address does not belong to user");
                }

                // 3. Kiểm tra cuối trước khi tạo order
                for (var cartItem : cart.getItems()) {
                        Dish dish = cartItem.getDish();

                        // 3.1 Kiểm tra trạng thái dish
                        if (dish.getStatus() != DishStatus.ACTIVE) {
                                throw new RuntimeException("Dish " + dish.getName() + " is not active");
                        }

                        // 3.2 Kiểm tra số lượng còn lại
                        if (cartItem.getQuantity() > dish.getRemainingServings()) {
                                throw new RuntimeException("Dish " + dish.getName() + " exceeds available servings");
                        }
                }

                // 3. Tính tổng tiền
                long totalAmount = cart.getItems().stream()
                                .mapToLong(i -> i.getQuantity() * i.getPriceSnapshot())
                                .sum();

                // 4. Tạo DishOrder
                DishOrder order = DishOrder.builder()
                                .buyer(buyer)
                                .seller(cart.getSellUser())
                                .orderStatus(OrderStatus.WAITING_PAYMENT)
                                .totalAmount(totalAmount)
                                .orderInfo("Thanh toán đơn hàng từ cart")
                                .address(address)
                                .shippingNote(shippingNote)
                                .build();
                dishOrderRepository.save(order);

                // 5. Tạo DishOrderItem từ cart
                List<DishOrderItem> items = cart.getItems().stream().map(cartItem -> {
                        DishOrderItem item = DishOrderItem.builder()
                                        .dishOrder(order)
                                        .dish(cartItem.getDish())
                                        .quantity(cartItem.getQuantity())
                                        .priceAtOrder(cartItem.getPriceSnapshot())
                                        .build();
                        return dishOrderItemRepository.save(item);
                }).toList();
                order.setItems(items);

                // 6. Chuyển cart status thành ORDERED
                cart.setStatus(CartStatus.ORDERED);
                cartRepository.save(cart);

                // 7. Tạo request thanh toán
                PaymentRequest paymentRequest = PaymentRequest.builder()
                                .order(order)
                                .amount(totalAmount)
                                .bankCode("VNBANK")
                                .language("vn")
                                .build();

                // 8. Gọi payment service
                return paymentService.createPayment(request, paymentRequest);
        }
}
