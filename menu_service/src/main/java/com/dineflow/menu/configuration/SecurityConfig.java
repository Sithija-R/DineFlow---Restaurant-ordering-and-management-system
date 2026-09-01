package com.dineflow.menu.configuration;

import com.dineflow.menu.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // ==========================================
                        // Public customer endpoints
                        // ==========================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/menu-items/**",
                                "/api/categories/**"
                        )
                        .permitAll()

                        // ==========================================
                        // Swagger
                        // ==========================================

                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        )
                        .permitAll()

                        // ==========================================
                        // Admin - Create
                        // ==========================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/menu-items",
                                "/api/categories"
                        )
                        .hasRole("ADMIN")

                        // ==========================================
                        // Admin - Update
                        // ==========================================

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/menu-items/**",
                                "/api/categories/**"
                        )
                        .hasRole("ADMIN")

                        // ==========================================
                        // Admin - Delete
                        // ==========================================

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/menu-items/**",
                                "/api/categories/**"
                        )
                        .hasRole("ADMIN")

                        // ==========================================
                        // Order Service - Reduce Stock
                        // ==========================================

                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/menu-items/*/reduce-stock"
                        )
                        .permitAll()

                        // ==========================================
                        // Other PATCH operations - Admin only
                        // ==========================================

                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/menu-items/**"
                        )
                        .hasRole("ADMIN")

                        // ==========================================
                        // Everything else
                        // ==========================================

                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}