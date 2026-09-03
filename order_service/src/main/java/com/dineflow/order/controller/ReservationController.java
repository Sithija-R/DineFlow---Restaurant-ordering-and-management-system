package com.dineflow.order.controller;

import com.dineflow.order.dto.ReservationRequest;
import com.dineflow.order.dto.ReservationResponse;
import com.dineflow.order.model.enums.ReservationStatus;
import com.dineflow.order.service.ReservationService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

        private final ReservationService reservationService;

        // Customer - create reservation
        @PostMapping
        public ResponseEntity<ReservationResponse> createReservation(
                        @Valid @RequestBody ReservationRequest request) {

                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(reservationService.createReservation(request));
        }

        // Customer - get reservation by ID
        @GetMapping("/{id}")
        public ResponseEntity<ReservationResponse> getReservation(
                        @PathVariable Long id) {

                return ResponseEntity.ok(
                                reservationService.getReservation(id));
        }

        @GetMapping("/reference/{reference}")
        public ResponseEntity<ReservationResponse> getReservation(
                        @PathVariable("reference") String reference) {

                return ResponseEntity.ok(
                                reservationService.getReservationByReference(reference));
        }

        // Admin - get reservations for a specific date
        @GetMapping
        public ResponseEntity<List<ReservationResponse>> getReservations(
                        @RequestParam(name = "date", required = false) LocalDate date) {

                if (date != null) {
                        return ResponseEntity.ok(
                                        reservationService.getReservationsByDate(date));
                }

                return ResponseEntity.ok(
                                reservationService.getAllReservations());
        }

        // Admin - confirm or cancel reservation
        @PatchMapping("/{id}/status")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ReservationResponse> updateStatus(
                        @PathVariable("id") Long id,
                        @RequestParam("status") ReservationStatus status) {

                return ResponseEntity.ok(
                                reservationService.updateStatus(id, status));
        }
}
