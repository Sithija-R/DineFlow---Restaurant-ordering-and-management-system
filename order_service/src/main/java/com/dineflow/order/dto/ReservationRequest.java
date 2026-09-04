package com.dineflow.order.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReservationRequest(

        @NotNull(message = "Date is required")
        @FutureOrPresent(message = "Date cannot be in the past")
        LocalDate date,

        @NotNull(message = "Start time is required")
        LocalTime startTime,

        @NotNull(message = "End time is required")
        LocalTime endTime,

        @NotNull(message = "Table is required")
        Long tableId,

        @NotBlank(message = "Customer name is required")
        @Size(max = 100)
        String customerName,

        @NotBlank(message = "Phone number is required")
        @Size(max = 20)
        String phoneNumber
) {}