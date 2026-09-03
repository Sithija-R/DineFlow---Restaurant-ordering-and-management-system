package com.dineflow.order.configuration;

import com.dineflow.order.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

import java.util.List;

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

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http) throws Exception {

                http
                                .csrf(csrf -> csrf.disable())

                                .cors(cors -> cors.configurationSource(
                                                corsConfigurationSource()))

                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))

                                .authorizeHttpRequests(auth -> auth

                                                // ==========================================
                                                // CUSTOMER - PLACE ORDER
                                                // ==========================================
                                                .requestMatchers(
                                                                HttpMethod.POST,
                                                                "/api/orders")
                                                .permitAll()

                                                // ==========================================
                                                // CUSTOMER - CHECK ORDER
                                                // ==========================================
                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/orders/*")
                                                .permitAll()

                                                // ==========================================
                                                // ADMIN - VIEW ORDERS
                                                // ==========================================
                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/orders")
                                                .hasRole("ADMIN")

                                                // ==========================================
                                                // ADMIN - UPDATE ORDER STATUS
                                                // ==========================================
                                                .requestMatchers(
                                                                HttpMethod.PATCH,
                                                                "/api/orders/*/status")
                                                .hasRole("ADMIN")

                                                // ==========================================
                                                // CUSTOMER - VIEW RESTAURANT TABLES
                                                // ==========================================
                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/tables",
                                                                "/api/tables/*")
                                                .permitAll()

                                                // ==========================================
                                                // CUSTOMER - CREATE RESERVATION
                                                // ==========================================
                                                .requestMatchers(
                                                                HttpMethod.POST,
                                                                "/api/reservations")
                                                .permitAll()

                                                // ==========================================
                                                // CUSTOMER - VIEW RESERVATION BY ID
                                                // ==========================================
                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/reservations/*")
                                                .permitAll()

                                                // ==========================================
                                                // CUSTOMER - VIEW RESERVATION BY REFERENCE
                                                // ==========================================
                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/reservations/reference/*")
                                                .permitAll()

                                                // ==========================================
                                                // Customer - VIEW RESERVATIONS
                                                // ==========================================
                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/reservations")
                                                .permitAll()

                                                // ==========================================
                                                // ADMIN - UPDATE RESERVATION STATUS
                                                // ==========================================
                                                .requestMatchers(
                                                                HttpMethod.PATCH,
                                                                "/api/reservations/*/status")
                                                .hasRole("ADMIN")

                                                // ==========================================
                                                // SWAGGER
                                                // ==========================================
                                                .requestMatchers(
                                                                "/swagger-ui/**",
                                                                "/v3/api-docs/**")
                                                .permitAll()

                                                // ==========================================
                                                // EVERYTHING ELSE
                                                // ==========================================
                                                .anyRequest().authenticated())

                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        // ==========================================
        // CORS
        // ==========================================
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(
                                List.of("http://localhost:5173"));

                configuration.setAllowedMethods(
                                List.of(
                                                "GET",
                                                "POST",
                                                "PUT",
                                                "PATCH",
                                                "DELETE",
                                                "OPTIONS"));

                configuration.setAllowedHeaders(
                                List.of(
                                                "Authorization",
                                                "Content-Type"));

                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration(
                                "/**",
                                configuration);

                return source;
        }
}
