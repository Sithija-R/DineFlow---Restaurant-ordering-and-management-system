package com.dineflow.order.controller;

import com.dineflow.order.dto.RestaurantTableResponse;
import com.dineflow.order.service.RestaurantTableService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class RestaurantTableController {

    private final RestaurantTableService tableService;

    @GetMapping
    public ResponseEntity<List<RestaurantTableResponse>> getAllTables() {
        return ResponseEntity.ok(tableService.getAllTables());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantTableResponse> getTable(
            @PathVariable Long id) {

        return ResponseEntity.ok(tableService.getTable(id));
    }
}