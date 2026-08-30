package com.dineflow.auth.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dineflow.auth.dto.AuthResponse;
import com.dineflow.auth.dto.LoginRequest;
import com.dineflow.auth.dto.RegisterRequest;
import com.dineflow.auth.dto.UserInfo;
import com.dineflow.auth.model.Role;
import com.dineflow.auth.model.User;
import com.dineflow.auth.repository.UserRepository;
import com.dineflow.auth.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role() != null ? request.role() : Role.USER)
                .name(request.name())
                .build();

        User savedUser = userRepository.save(user);

        UserInfo userInfo = new UserInfo(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getName(),
                savedUser.getRole().name()
        );

        UserDetails userDetails =
                org.springframework.security.core.userdetails.User
                        .withUsername(savedUser.getEmail())
                        .password(savedUser.getPassword())
                        .roles(savedUser.getRole().name())
                        .build();

        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(
                "User registered successfully",
                token,
                userInfo
        );
    }

    public AuthResponse login(LoginRequest request) {
        
        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.email(),
                                request.password()
                        )
                );

        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();

        String token = jwtService.generateToken(userDetails);

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        UserInfo userInfo = new UserInfo(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole().name()
        );

        return new AuthResponse(
                "Login successful",
                token,
                userInfo
        );
    }
}