package com.example.cooking.domain;

import java.util.Map;

import com.example.cooking.common.enums.OrderAction;
import com.example.cooking.common.enums.OrderStatus;
import com.example.cooking.exception.CustomException;

public class OrderTransition {

    private static final Map<OrderStatus, Map<OrderAction, OrderStatus>> TRANSITIONS =
            Map.of(
                OrderStatus.WAITING_PAYMENT, Map.of(
                    OrderAction.PAY_SUCCESS, OrderStatus.PAID,
                    OrderAction.BUYER_CANCEL, OrderStatus.CANCELLED_BY_BUYER
                ),
                OrderStatus.PAID, Map.of(
                    OrderAction.SELLER_CONFIRM, OrderStatus.CONFIRMED_BY_SELLER,
                    OrderAction.BUYER_CANCEL, OrderStatus.CANCELLED_BY_BUYER,
                    OrderAction.PAYMENT_FAIL, OrderStatus.CANCELLED_BY_PAYMENT_FAIL
                ),
                OrderStatus.CONFIRMED_BY_SELLER, Map.of(
                    OrderAction.SELLER_SHIP, OrderStatus.SHIPPED
                ),
                OrderStatus.SHIPPED, Map.of(
                    OrderAction.BUYER_CONFIRM_RECEIVED, OrderStatus.DELIVERED
                ),
                OrderStatus.DELIVERED, Map.of(
                    OrderAction.SYSTEM_COMPLETE, OrderStatus.COMPLETED
                )
            );

    public static OrderStatus next(OrderStatus current, OrderAction action) {
        if (!TRANSITIONS.containsKey(current) ||
            !TRANSITIONS.get(current).containsKey(action)) {
            throw new CustomException(
                "Invalid transition: " + current + " -> " + action
            );
        }
        return TRANSITIONS.get(current).get(action);
    }
}
