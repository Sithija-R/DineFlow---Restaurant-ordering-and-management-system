package com.dineflow.menu.service;

import com.dineflow.menu.dto.MenuItemRequest;
import com.dineflow.menu.dto.MenuItemResponse;
import com.dineflow.menu.exception.ResourceNotFoundException;
import com.dineflow.menu.model.Category;
import com.dineflow.menu.model.MenuItem;
import com.dineflow.menu.model.enums.AvailabilityStatus;
import com.dineflow.menu.repository.CategoryRepository;
import com.dineflow.menu.repository.MenuItemRepository;

import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
        Specification<MenuItem> specification = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String keyword = "%" + search.toLowerCase() + "%";

                Predicate namePredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")),
                        keyword
                );

                Predicate descriptionPredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("description")),
                        keyword
                );

                predicates.add(
                        criteriaBuilder.or(
                                namePredicate,
                                descriptionPredicate
                        )
                );
            }

            if (categoryId != null) {
                predicates.add(
                        criteriaBuilder.equal(
                                root.get("category").get("id"),
                                categoryId
                        )
                );
            }

            return criteriaBuilder.and(
                    predicates.toArray(new Predicate[0])
            );
        };

        return menuItemRepository.findAll(specification)
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

    public MenuItemResponse updateAvailability(Long id, AvailabilityStatus status) {
        MenuItem menuItem = findMenuItem(id);
        menuItem.setStatus(status);

        return toResponse(menuItemRepository.save(menuItem));
    }

    private AvailabilityStatus calculateStatus(Integer count) {
        return count > 0
                ? AvailabilityStatus.AVAILABLE
                : AvailabilityStatus.OUT_OF_STOCK;
    }

    @Transactional
    public void reduceStock(Long id, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException(
                    "Quantity must be greater than zero"
            );
        }

        MenuItem menuItem = findMenuItem(id);

        if (menuItem.getAvailableCount() < quantity) {
            throw new IllegalArgumentException(
                    "Insufficient stock for menu item: " + menuItem.getName()
            );
        }

        int remaining = menuItem.getAvailableCount() - quantity;

        menuItem.setAvailableCount(remaining);
        menuItem.setStatus(
                remaining > 0
                        ? AvailabilityStatus.AVAILABLE
                        : AvailabilityStatus.OUT_OF_STOCK
        );

        menuItemRepository.save(menuItem);
    }

    private MenuItem findMenuItem(Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Menu item not found with id: " + id
                        )
                );
    }

    private Category findCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found with id: " + id
                        )
                );
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
                item.getCategory().getName()
        );
    }
}