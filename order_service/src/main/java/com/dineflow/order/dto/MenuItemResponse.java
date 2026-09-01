package com.dineflow.order.dto;


import java.math.BigDecimal;

import com.dineflow.order.model.enums.AvailabilityStatus;

public record MenuItemResponse(
        Long id,
        String name,
        BigDecimal price,
        AvailabilityStatus status,
        Integer availableCount
) {
}