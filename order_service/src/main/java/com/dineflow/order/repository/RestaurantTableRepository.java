package com.dineflow.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dineflow.order.model.RestaurantTable;

import java.util.List;

public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {

    List<RestaurantTable> findByActiveTrue();
}