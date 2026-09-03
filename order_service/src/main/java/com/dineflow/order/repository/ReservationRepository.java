package com.dineflow.order.repository;

import com.dineflow.order.model.Reservation;
import com.dineflow.order.model.enums.ReservationStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository
        extends JpaRepository<Reservation, Long> {

    @Query("""
        SELECT COUNT(r) > 0
        FROM Reservation r
        WHERE r.table.id = :tableId
          AND r.date = :date
          AND r.status IN :statuses
          AND r.startTime < :endTime
          AND r.endTime > :startTime
    """)
    boolean existsOverlappingReservation(
            @Param("tableId") Long tableId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("statuses") Collection<ReservationStatus> statuses
    );

    List<Reservation> findByDateOrderByStartTimeAsc(LocalDate date);

    Optional<Reservation> findByReservationReference(String reservationReference);
}