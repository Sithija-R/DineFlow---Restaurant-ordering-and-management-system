package com.dineflow.order.service;

import com.dineflow.order.dto.ReservationRequest;
import com.dineflow.order.dto.ReservationResponse;
import com.dineflow.order.exception.ResourceNotFoundException;
import com.dineflow.order.exception.TableAlreadyReservedException;
import com.dineflow.order.model.Reservation;
import com.dineflow.order.model.RestaurantTable;
import com.dineflow.order.model.enums.ReservationStatus;
import com.dineflow.order.repository.ReservationRepository;
import com.dineflow.order.repository.RestaurantTableRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservationService {

        private final ReservationRepository reservationRepository;
        private final RestaurantTableRepository tableRepository;

        @Transactional
        public ReservationResponse createReservation(ReservationRequest request) {

                // Validate time range
                if (!request.endTime().isAfter(request.startTime())) {
                        throw new IllegalArgumentException("End time must be after start time");
                }

                // Find table
                RestaurantTable table = tableRepository.findById(request.tableId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Table not found: " + request.tableId()));

                // Check for overlapping reservations
                boolean alreadyBooked = reservationRepository.existsOverlappingReservation(
                                table.getId(),
                                request.date(),
                                request.startTime(),
                                request.endTime(),
                                List.of(
                                                ReservationStatus.PENDING,
                                                ReservationStatus.CONFIRMED));

                if (alreadyBooked) {
                        throw new TableAlreadyReservedException(
                                        "Table is already reserved for the selected date and time");
                }

                // Create reservation
                Reservation reservation = Reservation.builder()
                                .reservationReference(generateReservationReference())
                                .date(request.date())
                                .startTime(request.startTime())
                                .endTime(request.endTime())
                                .customerName(request.customerName())
                                .phoneNumber(request.phoneNumber())
                                .table(table)
                                .status(ReservationStatus.PENDING)
                                .createdAt(LocalDateTime.now())
                                .build();

                Reservation saved = reservationRepository.save(reservation);

                return toResponse(saved);
        }

        @Transactional(readOnly = true)
        public ReservationResponse getReservation(Long id) {

                Reservation reservation = reservationRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Reservation not found: " + id));

                return toResponse(reservation);
        }

        @Transactional(readOnly = true)
        public List<ReservationResponse> getReservationsByDate(LocalDate date) {

                return reservationRepository
                                .findByDateOrderByStartTimeAsc(date)
                                .stream()
                                .map(this::toResponse)
                                .toList();
        }

        @Transactional(readOnly = true)
        public ReservationResponse getReservationByReference(String reference) {

                Reservation reservation = reservationRepository
                                .findByReservationReference(reference)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Reservation not found: " + reference));

                return toResponse(reservation);
        }

        @Transactional(readOnly = true)
        public List<ReservationResponse> getAllReservations() {

                return reservationRepository
                                .findAll()
                                .stream()
                                .map(this::toResponse)
                                .toList();
        }

        @Transactional
        public ReservationResponse updateStatus(
                        Long id,
                        ReservationStatus status) {

                Reservation reservation = reservationRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + id));

                reservation.setStatus(status);
                Reservation updated = reservationRepository.save(reservation);

                return toResponse(updated);
        }

        private ReservationResponse toResponse(Reservation reservation) {

                return new ReservationResponse(
                                reservation.getId(),
                                reservation.getReservationReference(),
                                reservation.getDate(),
                                reservation.getStartTime(),
                                reservation.getEndTime(),
                                reservation.getTable().getId(),
                                reservation.getTable().getTableNumber(),
                                reservation.getCustomerName(),
                                reservation.getPhoneNumber(),
                                reservation.getStatus(),
                                reservation.getCreatedAt());
        }

        private String generateReservationReference() {

                return "RES-" +
                                UUID.randomUUID()
                                                .toString()
                                                .substring(0, 8)
                                                .toUpperCase();
        }
}