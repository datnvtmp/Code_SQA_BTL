package com.example.cooking.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.cooking.common.enums.OrderAction;
import com.example.cooking.common.enums.OrderStatus;
import com.example.cooking.model.Order;
import com.example.cooking.model.User;
import com.example.cooking.repository.OrderRepository;
import com.example.cooking.domain.*;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderTransitionService {

    private final OrderRepository orderRepository;

    public void transition(Order order, OrderAction action, Long actorId) {

        validateActor(order, action, actorId);

        OrderStatus nextStatus =
                OrderTransition.next(order.getOrderStatus(), action);

        order.setOrderStatus(nextStatus);
        orderRepository.save(order);
    }

    private void validateActor(Order order, OrderAction action, Long actorId) {

        switch (action) {
            case SELLER_CONFIRM, SELLER_SHIP -> {
                if (order.getSeller() == null ||
                    !order.getSeller().getId().equals(actorId)) {
                    throw new SecurityException("Not seller of this order");
                }
            }
            case BUYER_CONFIRM_RECEIVED, BUYER_CANCEL -> {
                if (!order.getBuyer().getId().equals(actorId)) {
                    throw new SecurityException("Not buyer of this order");
                }
            }
            case SYSTEM_COMPLETE, PAY_SUCCESS, PAYMENT_FAIL -> {
                // system / payment callback
            }
            default -> throw new IllegalStateException("Unknown action");
        }
    }
}
