package com.dineflow.auth.dto;

public record ErrorResponse(
        int status,
        String message
) {
}