package com.dineflow.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(

        @NotBlank(message = "email is required")
        String email,

        @NotBlank(message = "Password is required")
        String password
) {
}