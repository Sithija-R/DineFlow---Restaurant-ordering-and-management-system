package com.dineflow.menu.dto;

import java.math.BigDecimal;

import com.dineflow.menu.model.enums.AvailabilityStatus;

public record MenuItemResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        AvailabilityStatus status,
        Integer availableCount,
        String imageUrl,
        Long categoryId,
        String categoryName
) {
}
