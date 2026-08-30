package com.dineflow.menu.service;

import com.dineflow.menu.dto.CategoryRequest;
import com.dineflow.menu.dto.CategoryResponse;

import com.dineflow.menu.model.Category;
import com.dineflow.menu.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        return toResponse(category);
    }

    
    public CategoryResponse createCategory(CategoryRequest request) {

        if (categoryRepository.existsByNameIgnoreCase(request.name())) {
            throw new RuntimeException("Category already exists");
        }
        Category category = Category.builder()
                .name(request.name())
                .build();

        return toResponse(categoryRepository.save(category));
    }


    public CategoryResponse updateCategory( Long id, CategoryRequest request ) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (categoryRepository.existsByNameIgnoreCase(request.name())
                && !category.getName().equalsIgnoreCase(request.name())) {
            throw new RuntimeException("Category already exists");
        }
        category.setName(request.name());
        return toResponse(categoryRepository.save(category));
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        categoryRepository.delete(category);
    }


    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName()
        );
    }
}