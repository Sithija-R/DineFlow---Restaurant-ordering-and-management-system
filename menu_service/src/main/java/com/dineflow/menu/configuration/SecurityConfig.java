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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

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

                // Enable CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Public customer endpoints
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/menu-items/**",
                                "/api/categories/**"
                        )
                        .permitAll()

                        // Swagger
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        )
                        .permitAll()

                        // Admin - Create
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/menu-items",
                                "/api/categories"
                        )
                        .hasRole("ADMIN")

                        // Admin - Update
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/menu-items/**",
                                "/api/categories/**"
                        )
                        .hasRole("ADMIN")

                        // Admin - Delete
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/menu-items/**",
                                "/api/categories/**"
                        )
                        .hasRole("ADMIN")

                        // Order Service - Reduce Stock
                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/menu-items/*/reduce-stock"
                        )
                        .permitAll()

                        // Other PATCH operations - Admin only
                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/menu-items/**"
                        )
                        .hasRole("ADMIN")

                        // Everything else
                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }


    // CORS Configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173",
                        "http://localhost:5174"
                        )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type"
                )
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}