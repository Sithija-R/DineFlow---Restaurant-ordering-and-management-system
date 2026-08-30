package com.dineflow.auth.dto;

public record AuthResponse(
        String messege,
        String token,
        UserInfo userInfo
) {
}