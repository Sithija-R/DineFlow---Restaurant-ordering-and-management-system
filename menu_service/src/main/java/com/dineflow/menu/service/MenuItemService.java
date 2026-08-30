package com.dineflow.menu.service;

import com.dineflow.menu.dto.MenuItemRequest;
import com.dineflow.menu.dto.MenuItemResponse;
import com.dineflow.menu.exception.ResourceNotFoundException;
import com.dineflow.menu.model.Category;
import com.dineflow.menu.model.MenuItem;
import com.dineflow.menu.model.enums.AvailabilityStatus;
import com.dineflow.menu.repository.CategoryRepository;
import com.dineflow.menu.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuItemService {

        private final MenuItemRepository menuItemRepository;
        private final CategoryRepository categoryRepository;

        public List<MenuItemResponse> getAllMenuItems() {
                return menuItemRepository.findAll()
                                .stream()
                                .map(this::toResponse)
                                .toList();
        }

        public MenuItemResponse getMenuItemById(Long id) {
                return toResponse(findMenuItem(id));
        }

        public List<MenuItemResponse> searchMenuItems(String search, Long categoryId) {
                return menuItemRepository
                                .searchMenuItems(search, categoryId)
                                .stream()
                                .map(this::toResponse)
                                .toList();
        }

        public MenuItemResponse createMenuItem(MenuItemRequest request) {

                Category category = findCategory(request.categoryId());

                AvailabilityStatus status = calculateStatus(request.availableCount());

                MenuItem menuItem = MenuItem.builder()
                                .name(request.name())
                                .description(request.description())
                                .price(request.price())
                                .availableCount(request.availableCount())
                                .status(status)
                                .imageUrl(request.imageUrl())
                                .category(category)
                                .build();

                return toResponse(menuItemRepository.save(menuItem));
        }

        public MenuItemResponse updateMenuItem(Long id, MenuItemRequest request) {

                MenuItem menuItem = findMenuItem(id);
                Category category = findCategory(request.categoryId());

                menuItem.setName(request.name());
                menuItem.setDescription(request.description());
                menuItem.setPrice(request.price());
                menuItem.setAvailableCount(request.availableCount());
                menuItem.setStatus(calculateStatus(request.availableCount()));
                menuItem.setImageUrl(request.imageUrl());
                menuItem.setCategory(category);

                return toResponse(menuItemRepository.save(menuItem));
        }

        public void deleteMenuItem(Long id) {
                MenuItem menuItem = findMenuItem(id);
                menuItemRepository.delete(menuItem);
        }

        public MenuItemResponse updateAvailability(
                        Long id,
                        AvailabilityStatus status) {
                MenuItem menuItem = findMenuItem(id);

                menuItem.setStatus(status);

                return toResponse(menuItemRepository.save(menuItem));
        }

        private AvailabilityStatus calculateStatus(Integer count) {
                return count > 0
                                ? AvailabilityStatus.AVAILABLE
                                : AvailabilityStatus.OUT_OF_STOCK;
        }

        private MenuItem findMenuItem(Long id) {
                return menuItemRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Menu item not found with id: " + id));
        }

        private Category findCategory(Long id) {
                return categoryRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Category not found with id: " + id));
        }

        private MenuItemResponse toResponse(MenuItem item) {
                return new MenuItemResponse(
                                item.getId(),
                                item.getName(),
                                item.getDescription(),
                                item.getPrice(),
                                item.getStatus(),
                                item.getAvailableCount(),
                                item.getImageUrl(),
                                item.getCategory().getId(),
                                item.getCategory().getName());
        }
}