package com.dineflow.auth.dto;

public record UserInfo(
    Long id,
    String email,
    String name,
    String role
) {}
