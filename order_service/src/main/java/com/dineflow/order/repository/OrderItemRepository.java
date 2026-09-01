package com.dineflow.order.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.dineflow.order.model.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}