package com.dineflow.order.dto;

import com.dineflow.order.model.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusRequest(

        @NotNull(message = "Status is required")
        OrderStatus status
) {
}