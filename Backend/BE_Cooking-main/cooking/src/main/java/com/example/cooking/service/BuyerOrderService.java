package com.example.cooking.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.cooking.common.PageDTO;
import com.example.cooking.common.enums.OrderAction;
import com.example.cooking.common.enums.OrderStatus;
import com.example.cooking.common.enums.TransactionStatus;
import com.example.cooking.common.enums.TransactionType;
import com.example.cooking.dto.DishInOrderDto;
import com.example.cooking.dto.DishOrderDTO;
import com.example.cooking.dto.DishOrderDetailDTO;
import com.example.cooking.dto.mapper.OrderMapper;
import com.example.cooking.exception.CustomException;
import com.example.cooking.model.DishOrder;
import com.example.cooking.model.WalletTransaction;
import com.example.cooking.repository.DishOrderItemRepository;
import com.example.cooking.repository.DishOrderRepository;
import com.example.cooking.repository.WalletTransactionRepository;
import com.example.cooking.security.MyUserDetails;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class BuyerOrderService {

    private final DishOrderRepository dishOrderRepository;
    private final OrderTransitionService orderTransitionService;
    private final OrderMapper orderMapper;
    private final DishOrderItemRepository dishOrderItemRepository;
    private final SellerWalletService sellerWalletService;
    private final WalletTransactionRepository walletTransactionRepository;

    public PageDTO<DishOrderDTO> getOrdersByStatus(Long buyerId, Pageable pageable, OrderStatus orderStatus) {
        Page<DishOrder> page = dishOrderRepository.findByBuyerIdAndOrderStatus(buyerId, orderStatus, pageable);
        List<DishOrderDTO> dishOrders = orderMapper.tDtos(page.getContent());
        return new PageDTO<>(page, dishOrders);
    }

    public PageDTO<DishOrderDTO> getPaidOrders(Long buyerId, Pageable pageable) {
        Page<DishOrder> page = dishOrderRepository.findByBuyerIdAndOrderStatus(buyerId, OrderStatus.PAID, pageable);
        List<DishOrderDTO> dishOrders = orderMapper.tDtos(page.getContent());
        return new PageDTO<>(page, dishOrders);
    }

    public PageDTO<DishOrderDTO> getShippedOrders(Long buyerId, Pageable pageable) {
        Page<DishOrder> page = dishOrderRepository.findByBuyerIdAndOrderStatus(buyerId, OrderStatus.SHIPPED, pageable);
        List<DishOrderDTO> dishOrders = orderMapper.tDtos(page.getContent());
        return new PageDTO<>(page, dishOrders);
    }

    public PageDTO<DishOrderDTO> getWatingPaidOrders(Long buyerId, Pageable pageable) {
        Page<DishOrder> page = dishOrderRepository.findByBuyerIdAndOrderStatus(buyerId, OrderStatus.WAITING_PAYMENT,
                pageable);
        List<DishOrderDTO> dishOrders = orderMapper.tDtos(page.getContent());
        return new PageDTO<>(page, dishOrders);
    }

    public DishOrderDetailDTO getOrderDetail(Long orderId, Long buyerId) {
        DishOrder dishOrder = dishOrderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException("Cannot find order"));
        if (!dishOrder.getBuyer().getId().equals(buyerId)) {
            throw new CustomException("Acess denied!");
        }
        List<DishInOrderDto> dishInOrderDtos = dishOrderItemRepository.findDishDtosByOrderId(orderId);
        DishOrderDetailDTO dishOrderDetailDTO = orderMapper.toDetailDTO(dishOrder);
        dishOrderDetailDTO.setDishInOrderDtos(dishInOrderDtos);
        return dishOrderDetailDTO;
    }

    public void confirmDelivered(Long orderId, MyUserDetails currentUser) {

        DishOrder order = dishOrderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException("Order not found"));
        orderTransitionService.transition(order, OrderAction.BUYER_CONFIRM_RECEIVED, currentUser.getId());

        // 4. (Optional) ghi lịch sử trạng thái
        // orderStatusHistoryService.log(...)
    }

    public void confirmComplete(Long orderId, MyUserDetails currentUser) {

        DishOrder order = dishOrderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException("Order not found"));
        orderTransitionService.transition(order, OrderAction.SYSTEM_COMPLETE, currentUser.getId());
        WalletTransaction transaction = walletTransactionRepository
        .findFirstByOrderIdAndTypeAndStatus(orderId, TransactionType.ORDER_REVENUE, TransactionStatus.COMPLETE)
        .orElseThrow(()-> new CustomException("có lỗi xảy ra, lh admin (mã: wlle cnt fnd)"));
        sellerWalletService.releasePending(order.getSeller().getId(), transaction.getAmount(), orderId);
        // 4. (Optional) ghi lịch sử trạng thái
        // orderStatusHistoryService.log(...)
    }

    public void cancelOrder(Long orderId, MyUserDetails currentUser) {

        DishOrder order = dishOrderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException("Order not found"));
        if (order.getOrderStatus() == OrderStatus.WAITING_PAYMENT) {
            orderTransitionService.transition(order, OrderAction.BUYER_CANCEL, currentUser.getId());
        }
        else {
            throw new CustomException("Chỉ có thể cancel đơn đang đợi thanh toán");
        }

        // 4. (Optional) ghi lịch sử trạng thái
        // orderStatusHistoryService.log(...)
    }
}
