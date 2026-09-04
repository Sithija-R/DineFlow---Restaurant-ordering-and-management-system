package com.dineflow.order.service;

import com.dineflow.order.dto.RestaurantTableResponse;
import com.dineflow.order.exception.ResourceNotFoundException;
import com.dineflow.order.model.RestaurantTable;
import com.dineflow.order.repository.RestaurantTableRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantTableService {

    private final RestaurantTableRepository tableRepository;

    @Transactional(readOnly = true)
    public List<RestaurantTableResponse> getAllTables() {

        return tableRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public RestaurantTableResponse getTable(Long id) {

        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Table not found: " + id
                        ));

        return toResponse(table);
    }

    private RestaurantTableResponse toResponse(RestaurantTable table) {

        return new RestaurantTableResponse(
                table.getId(),
                table.getTableNumber()
        );
    }
}