package com.dineflow.order.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.dineflow.order.model.enums.ReservationStatus;

public record ReservationResponse(
        Long id,
        String reservationReference,
        LocalDate date,
        LocalTime startTime,
        LocalTime endTime,
        Long tableId,
        Integer tableNumber,
        String customerName,
        String phoneNumber,
        ReservationStatus status,
        LocalDateTime createdAt
) {}