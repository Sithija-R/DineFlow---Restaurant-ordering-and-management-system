package com.dineflow.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.dineflow.order.model.enums.OrderStatus;
import com.dineflow.order.model.enums.OrderType;

public record OrderResponse(
        Long id,
        String orderReference,
        String customerName,
        String phoneNumber,
        OrderType orderType,
        Integer tableNumber,
        OrderStatus status,
        BigDecimal total,
        LocalDateTime createdAt,
        List<OrderItemResponse> items
) {
}