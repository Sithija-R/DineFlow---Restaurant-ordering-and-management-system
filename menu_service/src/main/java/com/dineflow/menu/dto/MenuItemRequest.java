package com.dineflow.menu.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record MenuItemRequest(

    @NotBlank(message = "Name is required")
    @Size(max = 100)
    String name,

    @Size(max = 500)
    String description,

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Digits(integer = 8, fraction = 2)
    BigDecimal price,

    @NotNull(message = "Category ID is required")
    Long categoryId,

    @NotNull(message = "Available count is required")
    @Min(value = 0, message = "Available count cannot be negative")
    Integer availableCount,

    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    String imageUrl
) {
}
