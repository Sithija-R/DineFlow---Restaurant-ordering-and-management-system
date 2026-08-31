package com.dineflow.order.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.dineflow.order.model.Order;
import com.dineflow.order.model.enums.OrderStatus;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderReference(String orderReference);

    List<Order> findByStatus(OrderStatus status);
}