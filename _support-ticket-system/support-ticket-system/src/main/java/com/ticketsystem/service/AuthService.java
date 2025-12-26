package com.ticketsystem.service;

import com.ticketsystem.dto.LoginRequest;
import com.ticketsystem.dto.LoginResponse;
import com.ticketsystem.dto.TwoFactorRequest;
import com.ticketsystem.model.User;
import com.ticketsystem.model.UserRole;
import com.ticketsystem.repository.UserRepository;
import com.ticketsystem.security.JwtTokenProvider;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TwoFactorAuthService twoFactorAuthService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ----------------- LOGIN -----------------
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AuthService.class);

    public LoginResponse login(LoginRequest request) {
        logger.debug("Attempting login for {}", request.getEmail());

        org.springframework.security.core.Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()));
            logger.debug("Authentication successful for {}", request.getEmail());
        } catch (BadCredentialsException ex) {
            logger.error("!!! LOGIN FAILED: Bad Credentials for {}", request.getEmail());
            // Check if user exists to verify if it's password or user issue
            userRepository.findByEmail(request.getEmail()).ifPresentOrElse(
                    u -> logger.error("DEBUG: User exists with hash: {}", u.getPassword()),
                    () -> logger.error("DEBUG: User DOES NOT exist"));
            throw new RuntimeException("Invalid email or password");
        } catch (Exception e) {
            logger.error("!!! LOGIN FAILED: Exception: " + e.getMessage(), e);
            throw new RuntimeException("Login failed: " + e.getMessage());
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    logger.error("DEBUG: User not found AFTER auth success? Impossible.");
                    return new RuntimeException("User not found");
                });

        LoginResponse response = new LoginResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());

        // If user has 2FA enabled, require code if not provided
        if (user.isTwoFactorEnabled()) {
            String code = request.getTwoFactorCode();

            if (code == null || code.isBlank()) {
                response.setTwoFactorRequired(true);
                response.setToken(null);
                response.setMessage("2FA code required.");
                return response;
            }

            boolean valid = twoFactorAuthService.verifyCode(user.getTwoFactorSecret(), code);
            if (!valid) {
                throw new RuntimeException("Invalid 2FA code");
            }
        }

        // Normal login (with or without 2FA if passed)
        String token = jwtTokenProvider.generateToken(authentication, user.getRole());
        response.setToken(token);
        response.setTwoFactorRequired(false);

        return response;
    }

    // ----------------- Verify 2FA in second step (if you want 2-step flow)
    // -----------------
    public LoginResponse verifyTwoFactorCode(TwoFactorRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isTwoFactorEnabled()) {
            throw new RuntimeException("2FA not enabled for this user");
        }

        boolean ok = twoFactorAuthService.verifyCode(user.getTwoFactorSecret(), request.getCode());
        if (!ok) {
            throw new RuntimeException("Invalid 2FA code");
        }

        org.springframework.security.core.Authentication auth = new UsernamePasswordAuthenticationToken(
                user.getEmail(),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));

        String token = jwtTokenProvider.generateToken(auth, user.getRole());

        LoginResponse response = new LoginResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setToken(token);
        response.setTwoFactorRequired(false);

        return response;
    }

    // ----------------- Register new user (default CUSTOMER) -----------------
    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(true);

        if (user.getRole() == null) {
            user.setRole(UserRole.CUSTOMER);
        }

        return userRepository.save(user);
    }

    // ----------------- Get currently logged-in user -----------------
    public User getCurrentUser() {
        org.springframework.security.core.Authentication authentication = SecurityContextHolder.getContext()
                .getAuthentication();

        if (authentication == null ||
                authentication.getPrincipal() == null ||
                authentication.getName().equals("anonymousUser")) {
            return null;
        }

        return userRepository.findByEmail(authentication.getName()).orElse(null);
    }

    // Helpers
    public boolean isAdmin(User user) {
        return user != null && user.getRole() == UserRole.ADMIN;
    }

    public boolean isAgent(User user) {
        return user != null && user.getRole() == UserRole.AGENT;
    }

    public boolean isCustomer(User user) {
        return user != null && user.getRole() == UserRole.CUSTOMER;
    }
}
