package com.dineflow.order.service;

import com.dineflow.order.client.MenuServiceClient;
import com.dineflow.order.dto.MenuItemResponse;
import com.dineflow.order.dto.OrderItemRequest;
import com.dineflow.order.dto.OrderItemResponse;
import com.dineflow.order.dto.OrderRequest;
import com.dineflow.order.dto.OrderResponse;
import com.dineflow.order.dto.OrderStatusRequest;
import com.dineflow.order.exception.InvalidOrderException;
import com.dineflow.order.exception.ResourceNotFoundException;
import com.dineflow.order.model.Order;
import com.dineflow.order.model.OrderItem;
import com.dineflow.order.model.enums.AvailabilityStatus;
import com.dineflow.order.model.enums.OrderStatus;
import com.dineflow.order.model.enums.OrderType;
import com.dineflow.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

        private final OrderRepository orderRepository;
        private final MenuServiceClient menuServiceClient;


        @Transactional
        public OrderResponse createOrder(OrderRequest request) {

                validateOrder(request);

                Order order = Order.builder()
                                .orderReference(generateOrderReference())
                                .customerName(request.customerName())
                                .phoneNumber(request.phoneNumber())
                                .orderType(request.orderType())
                                .tableNumber(request.tableNumber())
                                .status(OrderStatus.PLACED)
                                .createdAt(LocalDateTime.now())
                                .total(BigDecimal.ZERO)
                                .build();

                BigDecimal total = BigDecimal.ZERO;

                for (OrderItemRequest itemRequest : request.items()) {

                        MenuItemResponse menuItem = menuServiceClient.getMenuItem(itemRequest.menuItemId());

                        if (menuItem == null) {
                                throw new ResourceNotFoundException("Menu item not found: " + itemRequest.menuItemId());
                        }

                        if (menuItem.status() != AvailabilityStatus.AVAILABLE) {
                                throw new InvalidOrderException("Menu item is currently unavailable: "+ menuItem.name());
                        }

                        if (menuItem.availableCount() < itemRequest.quantity()) {
                                throw new InvalidOrderException("Insufficient stock for menu item: "+ menuItem.name());
                        }

                        BigDecimal subtotal = menuItem.price().multiply(BigDecimal.valueOf(itemRequest.quantity()));

                        OrderItem orderItem = OrderItem.builder()
                                        .menuItemId(menuItem.id())
                                        .menuItemName(menuItem.name())
                                        .quantity(itemRequest.quantity())
                                        .unitPrice(menuItem.price())
                                        .subtotal(subtotal)
                                        .order(order)
                                        .build();

                        order.getItems().add(orderItem);

                        // Reduce stock in menu-service
                        menuServiceClient.reduceStock( menuItem.id(), itemRequest.quantity());

                        total = total.add(subtotal);
                }

                order.setTotal(total);

                Order savedOrder = orderRepository.save(order);

                return toResponse(savedOrder);
        }

        public OrderResponse getOrderByReference(String reference) {

                Order order = orderRepository
                                .findByOrderReference(reference)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Order not found: " + reference));

                return toResponse(order);
        }

        public List<OrderResponse> getAllOrders() {
                return orderRepository.findAll()
                                .stream()
                                .map(this::toResponse)
                                .toList();
        }

        public List<OrderResponse> getOrdersByStatus(OrderStatus status) {
                return orderRepository.findByStatus(status)
                                .stream()
                                .map(this::toResponse)
                                .toList();
        }

        @Transactional
        public OrderResponse updateStatus(Long id, OrderStatusRequest request) {

                Order order = orderRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));

                validateStatusTransition(order.getStatus(), request.status());

                order.setStatus(request.status());
                return toResponse(orderRepository.save(order));
        }


        private void validateOrder(OrderRequest request) {

                if (request.orderType() == OrderType.DINE_IN && request.tableNumber() == null) {
                        throw new IllegalArgumentException("Table number is required for dine-in orders");
                }

                if (request.orderType() == OrderType.TAKEAWAY && request.tableNumber() != null) {
                        throw new IllegalArgumentException("Table number should not be provided for takeaway orders");
                }
        }


        private void validateStatusTransition(OrderStatus current, OrderStatus next) {

                if (current == OrderStatus.CANCELLED || current == OrderStatus.COMPLETED) {
                        throw new IllegalArgumentException("Cannot change status of a completed or cancelled order");
                }

                if (next == OrderStatus.CANCELLED) {
                        return;
                }

                boolean valid = (current == OrderStatus.PLACED
                                && next == OrderStatus.CONFIRMED)

                                || (current == OrderStatus.CONFIRMED
                                                && next == OrderStatus.PREPARING)

                                || (current == OrderStatus.PREPARING
                                                && next == OrderStatus.READY)

                                || (current == OrderStatus.READY
                                                && next == OrderStatus.COMPLETED);

                if (!valid) {
                        throw new InvalidOrderException("Invalid order status transition: " + current + " → " + next);
                }
        }

        private String generateOrderReference() {
                return "DF-" + UUID.randomUUID()
                                .toString()
                                .substring(0, 8)
                                .toUpperCase();
        }

        private OrderResponse toResponse(Order order) {

                List<OrderItemResponse> items = order.getItems()
                                .stream()
                                .map(item -> new OrderItemResponse(
                                                item.getMenuItemId(),
                                                item.getMenuItemName(),
                                                item.getQuantity(),
                                                item.getUnitPrice(),
                                                item.getSubtotal()))
                                .toList();

                return new OrderResponse(
                                order.getId(),
                                order.getOrderReference(),
                                order.getCustomerName(),
                                order.getPhoneNumber(),
                                order.getOrderType(),
                                order.getTableNumber(),
                                order.getStatus(),
                                order.getTotal(),
                                order.getCreatedAt(),
                                items);
        }
}