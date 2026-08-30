package com.dineflow.menu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dineflow.menu.model.MenuItem;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    @Query("""
        SELECT m
        FROM MenuItem m
        WHERE
            (:search IS NULL OR
             LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%')) OR
             LOWER(m.description) LIKE LOWER(CONCAT('%', :search, '%')))
        AND
            (:categoryId IS NULL OR m.category.id = :categoryId)
        """)
    List<MenuItem> searchMenuItems(
            @Param("search") String search,
            @Param("categoryId") Long categoryId
    );
}