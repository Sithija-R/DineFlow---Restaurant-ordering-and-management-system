package com.dineflow.order.dto;


import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.List;

import com.dineflow.order.model.enums.OrderType;

public record OrderRequest(

        @NotBlank(message = "Customer name is required")
        @Size(max = 100)
        String customerName,

        @NotBlank(message = "Phone number is required")
        @Size(max = 20)
        String phoneNumber,

        @NotNull(message = "Order type is required")
        OrderType orderType,

        @Min(value = 1, message = "Table number must be positive")
        Integer tableNumber,

        @NotEmpty(message = "Order must contain at least one item")
        List<@Valid OrderItemRequest> items
) {
}