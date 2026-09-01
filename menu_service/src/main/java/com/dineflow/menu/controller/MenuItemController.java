package com.dineflow.menu.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dineflow.menu.dto.MenuItemRequest;
import com.dineflow.menu.dto.MenuItemResponse;
import com.dineflow.menu.model.enums.AvailabilityStatus;
import com.dineflow.menu.service.MenuItemService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/menu-items")
@RequiredArgsConstructor
public class MenuItemController {

        private final MenuItemService menuItemService;

        @GetMapping
        public ResponseEntity<List<MenuItemResponse>> getMenuItems(
                        @RequestParam(name = "search", required = false) String search,
                        @RequestParam(name = "categoryId", required = false) Long categoryId) {

                return ResponseEntity.ok(menuItemService.searchMenuItems(search, categoryId));
        }

        @GetMapping("/{id}")
        public ResponseEntity<MenuItemResponse> getMenuItemById(@PathVariable("id") Long id) {

                return ResponseEntity.ok(menuItemService.getMenuItemById(id));
        }

        @PostMapping
        public ResponseEntity<MenuItemResponse> createMenuItem(@Valid @RequestBody MenuItemRequest request) {

                return ResponseEntity.status(HttpStatus.CREATED).body(menuItemService.createMenuItem(request));
        }

        @PutMapping("/{id}")
        public ResponseEntity<MenuItemResponse> updateMenuItem(
                        @PathVariable("id") Long id,
                        @Valid @RequestBody MenuItemRequest request) {

                return ResponseEntity.ok(menuItemService.updateMenuItem(id, request));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Map<String, String>> deleteMenuItem( @PathVariable("id") Long id) {

                menuItemService.deleteMenuItem(id);
                Map<String, String> response = new HashMap<>(); response.put("message", "Menu item deleted successfully");
                return ResponseEntity.ok(response);
        }

        @PatchMapping("/{id}/availability")
        public ResponseEntity<MenuItemResponse> updateAvailability(
                        @PathVariable("id") Long id,
                        @RequestParam(name = "status") AvailabilityStatus status) {

                return ResponseEntity.ok(menuItemService.updateAvailability(id, status));
        }

        @PatchMapping("/{id}/reduce-stock")
        public ResponseEntity<Void> reduceStock(
                        @PathVariable("id") Long id,
                        @RequestBody Integer quantity) {

                menuItemService.reduceStock(id, quantity);

                return ResponseEntity.noContent().build();
        }
}