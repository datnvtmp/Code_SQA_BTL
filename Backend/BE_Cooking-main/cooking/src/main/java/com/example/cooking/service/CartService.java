package com.example.cooking.service;

import com.example.cooking.dto.request.AddCartItemRequest;
import com.example.cooking.dto.request.UpdateCartItemRequest;
import com.example.cooking.exception.CustomException;
import com.example.cooking.dto.CartDto;
import com.example.cooking.dto.CartItemDto;
import com.example.cooking.model.Cart;
import com.example.cooking.model.CartItem;
import com.example.cooking.model.Dish;
import com.example.cooking.model.User;
import com.example.cooking.common.enums.CartStatus;
import com.example.cooking.common.enums.DishStatus;
import com.example.cooking.repository.CartRepository;
import com.example.cooking.repository.DishRepository;
import com.example.cooking.repository.UserRepository;
import com.example.cooking.security.MyUserDetails;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final DishRepository dishRepository;
    private final UserRepository userRepository;

    /** Thêm món vào ACTIVE cart cho seller, tạo mới nếu chưa có */
    public CartDto  addItem(MyUserDetails myUserDetails, AddCartItemRequest request) {
        User user = userRepository.getReferenceById(myUserDetails.getId());
        Dish dish = dishRepository.findById(request.getDishId())
                .orElseThrow(() -> new CustomException("Dish not found"));
        if (dish.getStatus() != DishStatus.ACTIVE) {
            throw new CustomException("Dish is not active");
        }
        // Kiểm tra số lượng
        if (dish.getRemainingServings() < request.getQuantity()) {
            throw new CustomException("Not enough servings available");
        }

        User seller = dish.getSellUser();

        Cart cart = getActiveCart(user, seller);

        // Kiểm tra món đã có trong cart chưa
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getDish().getId().equals(dish.getId()))
                .findFirst()
                .orElse(null);

        if (item != null) {
            System.out.println("HELLLOOOO1");
            item.setQuantity(item.getQuantity() + request.getQuantity());
        } else {
            System.out.println("HELLLOOOO2");
            item = new CartItem();
            item.setCart(cart);
            item.setDish(dish);
            item.setQuantity(request.getQuantity());
            item.setPriceSnapshot(dish.getPrice());
            cart.getItems().add(item);
        }

        cartRepository.save(cart);
        return mapToDto(cart);
    }

    /** Lấy tất cả ACTIVE cart của user (mỗi cart 1 seller) */
    public List<CartDto> getAllActiveCarts(MyUserDetails myUserDetails) {
        User user = userRepository.getReferenceById(myUserDetails.getId());
        List<Cart> carts = cartRepository.findAllByUserAndStatus(user, CartStatus.ACTIVE);
        return carts.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    /** Xóa món khỏi ACTIVE cart theo seller */
    public CartDto removeItem(MyUserDetails myUserDetails, Long cartId, Long dishId) {
        User user = userRepository.getReferenceById(myUserDetails.getId());

        Cart cart = cartRepository.findByIdAndUserIdAndStatus(cartId, user.getId(), CartStatus.ACTIVE)
                .orElseThrow(() -> new CustomException("Active cart not found for seller"));

        cart.getItems().removeIf(i -> i.getDish().getId().equals(dishId));
        cartRepository.save(cart);
        return mapToDto(cart);
    }
    
    /** Cập nhật số lượng món trong ACTIVE cart */
    public CartDto updateItemQuantity(MyUserDetails myUserDetails, Long cartId, UpdateCartItemRequest request) {
        User user = userRepository.getReferenceById(myUserDetails.getId());

        // 1. Tìm giỏ hàng ACTIVE của user
        Cart cart = cartRepository.findByIdAndUserIdAndStatus(cartId, user.getId(), CartStatus.ACTIVE)
                .orElseThrow(() -> new CustomException("Active cart not found"));

        // 2. Tìm item trong giỏ
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getDish().getId().equals(request.getDishId()))
                .findFirst()
                .orElseThrow(() -> new CustomException("Item not found in cart"));

        // 3. Nếu số lượng <= 0, xóa luôn món đó khỏi giỏ
        if (request.getQuantity() <= 0) {
            cart.getItems().remove(item);
        } else {
            // 4. Kiểm tra xem món ăn còn đủ số lượng không
            Dish dish = item.getDish();
            if (dish.getRemainingServings() < request.getQuantity()) {
                throw new CustomException("Not enough servings available for " + dish.getName());
            }
            
            // 5. Cập nhật số lượng mới
            item.setQuantity(request.getQuantity());
            // Cập nhật lại snapshot giá nếu giá món ăn thay đổi (tùy nghiệp vụ của bạn)
            item.setPriceSnapshot(dish.getPrice()); 
        }

        cartRepository.save(cart);
        return mapToDto(cart);
    }

    /** Tìm hoặc tạo ACTIVE cart theo seller */
    private Cart getActiveCart(User user, User seller) {
        return cartRepository.findByUserAndSellUserAndStatus(user, seller, CartStatus.ACTIVE)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    newCart.setSellUser(seller);
                    newCart.setStatus(CartStatus.ACTIVE);
                    return cartRepository.save(newCart);
                });
    }




    /** Chuyển đổi Cart -> CartDto */
    private CartDto mapToDto(Cart cart) {
        List<CartItemDto> items = cart.getItems().stream()
                .map(i -> new CartItemDto(
                        i.getDish().getId(),
                        i.getDish().getName(),
                        i.getQuantity(),
                        i.getPriceSnapshot()))
                .collect(Collectors.toList());

        Long totalAmount = items.stream()
                .mapToLong(i -> i.getQuantity() * i.getPriceSnapshot())
                .sum();

        return new CartDto(cart.getId(), cart.getSellUser().getId(), items, totalAmount);
    }

    public CartDto getCartBySeller(MyUserDetails myUserDetails, Long sellerId) {
        User user = userRepository.getReferenceById(myUserDetails.getId());
        User seller = userRepository.getReferenceById(sellerId);

        Cart cart = cartRepository.findByUserAndSellUserAndStatus(user, seller, CartStatus.ACTIVE)
                .orElseThrow(() -> new CustomException("Active cart not found for this seller"));

        return mapToDto(cart);
    }
        public CartDto getCartById(MyUserDetails myUserDetails, Long cartId) {
        User user = userRepository.getReferenceById(myUserDetails.getId());

        Cart cart = cartRepository.findByIdAndUserIdAndStatus(cartId, user.getId(), CartStatus.ACTIVE)
                .orElseThrow(() -> new CustomException("Active cart not found"));

        return mapToDto(cart);
    }

}
