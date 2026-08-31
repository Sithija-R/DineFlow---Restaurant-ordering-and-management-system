package com.dineflow.order.controller;


import com.dineflow.order.dto.OrderRequest;
import com.dineflow.order.dto.OrderResponse;
import com.dineflow.order.dto.OrderStatusRequest;
import com.dineflow.order.model.enums.OrderStatus;
import com.dineflow.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Customer - place order
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder( @Valid @RequestBody OrderRequest request) {
        System.out.println("🔥 ORDER CONTROLLER CALLED 🔥");
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(request));
    }

    // Customer - check order status/details
    @GetMapping("/{reference}")
    public ResponseEntity<OrderResponse> getOrderByReference(@PathVariable("reference") String reference) {
        return ResponseEntity.ok(
                orderService.getOrderByReference(reference)
        );
    }

    // Admin - view all orders
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders( @RequestParam(name="status", required = false) OrderStatus status ) {
        if (status != null) {
            return ResponseEntity.ok(
                    orderService.getOrdersByStatus(status)
            );
        }
        return ResponseEntity.ok(orderService.getAllOrders()
        );
    }

    // Admin - update order status
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus( @PathVariable("id") Long id, @Valid @RequestBody OrderStatusRequest request) {
        return ResponseEntity.ok(
                orderService.updateStatus(id, request)
        );
    }
}