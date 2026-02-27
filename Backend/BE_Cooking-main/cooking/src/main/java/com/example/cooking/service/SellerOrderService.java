package com.example.cooking.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.cooking.common.PageDTO;
import com.example.cooking.common.enums.OrderAction;
import com.example.cooking.common.enums.OrderStatus;
import com.example.cooking.dto.DishInOrderDto;
import com.example.cooking.dto.DishOrderDTO;
import com.example.cooking.dto.DishOrderDetailDTO;
import com.example.cooking.dto.mapper.OrderMapper;
import com.example.cooking.exception.CustomException;
import com.example.cooking.model.DishOrder;
import com.example.cooking.repository.DishOrderItemRepository;
import com.example.cooking.repository.DishOrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SellerOrderService {

    private final DishOrderRepository dishOrderRepository;
    private final OrderTransitionService orderTransitionService;
    private final DishOrderItemRepository dishOrderItemRepository;
    private final OrderMapper orderMapper;

    public PageDTO<DishOrderDTO> getPaidOrders(Long sellerId, Pageable pageable) {
        Page<DishOrder> page = dishOrderRepository.findBySellerIdAndOrderStatus(sellerId, OrderStatus.PAID,pageable);
        List<DishOrderDTO> dishOrders = orderMapper.tDtos(page.getContent());
        return new PageDTO<>(page,dishOrders);
    }

    public PageDTO<DishOrderDTO> getOrdersByStatus(Long sellerId, Pageable pageable, OrderStatus orderStatus) {
        if (orderStatus != OrderStatus.PAID
            && orderStatus != OrderStatus.SHIPPED
            && orderStatus != OrderStatus.CONFIRMED_BY_SELLER
            && orderStatus != OrderStatus.DELIVERED
            && orderStatus != OrderStatus.COMPLETED) {
            throw new CustomException("Bạn không thể xem các order có trạng thái này");
        }
        Page<DishOrder> page = dishOrderRepository.findBySellerIdAndOrderStatus(sellerId, orderStatus, pageable);
        List<DishOrderDTO> dishOrders = orderMapper.tDtos(page.getContent());
        return new PageDTO<>(page, dishOrders);
    }

    public DishOrderDetailDTO getOrderDetail(Long orderId, Long sellerId){
        DishOrder dishOrder = dishOrderRepository.findById(orderId).orElseThrow(()->new CustomException("Cannot find order"));
        if (!dishOrder.getSeller().getId().equals(sellerId)){
            throw new CustomException("Acess denied!");
        }
        List<DishInOrderDto> dishInOrderDtos = dishOrderItemRepository.findDishDtosByOrderId(orderId);
        DishOrderDetailDTO dishOrderDetailDTO = orderMapper.toDetailDTO(dishOrder);
        dishOrderDetailDTO.setDishInOrderDtos(dishInOrderDtos);
        return dishOrderDetailDTO;
    }

    @Transactional
    public void confirmOrder(Long orderId, Long sellerId) {

        DishOrder order = dishOrderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException("Order not found"));

        orderTransitionService.transition(
            order,
            OrderAction.SELLER_CONFIRM,
            sellerId
        );
    }

    @Transactional
    public void shipOrder(Long orderId, Long sellerId) {

        DishOrder order = dishOrderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException("Order not found"));

        if (!order.getSeller().getId().equals(sellerId)) {
            throw new CustomException("Not your order");
        }

        if (order.getOrderStatus() != OrderStatus.CONFIRMED_BY_SELLER) {
            throw new CustomException("Order is not confirmed yet");
        }

        order.setOrderStatus(OrderStatus.SHIPPED);
    }

}
