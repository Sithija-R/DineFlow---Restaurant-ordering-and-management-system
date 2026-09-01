package com.dineflow.menu.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dineflow.menu.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByNameIgnoreCase(String name);
}
