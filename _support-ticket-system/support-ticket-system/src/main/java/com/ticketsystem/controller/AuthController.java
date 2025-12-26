package com.ticketsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ticketsystem.dto.LoginRequest;
import com.ticketsystem.dto.LoginResponse;
import com.ticketsystem.dto.PasswordResetConfirmRequest;
import com.ticketsystem.dto.PasswordResetRequest;
import com.ticketsystem.dto.RegisterRequest;
import com.ticketsystem.dto.TwoFactorRequest;
import com.ticketsystem.dto.TwoFactorResponse;
import com.ticketsystem.model.User;
import com.ticketsystem.model.UserRole;
import com.ticketsystem.repository.UserRepository;
import com.ticketsystem.service.AuthService;
import com.ticketsystem.service.PasswordResetService;
import com.ticketsystem.service.TwoFactorAuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private TwoFactorAuthService twoFactorAuthService;

    @Autowired
    private PasswordResetService passwordResetService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ---------- LOGIN ----------
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        System.out.println("DEBUG: AuthController.login reached for email: " + request.getEmail());
        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (RuntimeException ex) {
            LoginResponse resp = new LoginResponse();
            resp.setMessage(ex.getMessage());
            return ResponseEntity.badRequest().body(resp);
        }
    }

    // ---------- VERIFY 2FA (if doing 2-step flow) ----------
    @PostMapping("/verify-2fa")
    public ResponseEntity<LoginResponse> verifyTwoFactor(@Valid @RequestBody TwoFactorRequest request) {
        try {
            return ResponseEntity.ok(authService.verifyTwoFactorCode(request));
        } catch (RuntimeException ex) {
            LoginResponse resp = new LoginResponse();
            resp.setMessage(ex.getMessage());
            return ResponseEntity.badRequest().body(resp);
        }
    }

    // ---------- CUSTOMER SELF-REGISTRATION ----------
    @PostMapping("/register")

    public ResponseEntity<?> registerCustomer(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(UserRole.CUSTOMER);
        user.setPhoneNumber(req.getPhoneNumber());
        user.setEnabled(true);

        userRepository.save(user);

        return ResponseEntity.ok("Customer registered successfully");
    }

    // ---------- ADMIN REGISTER AGENT ----------
    @PostMapping("/register-agent")
    public ResponseEntity<?> registerAgent(@Valid @RequestBody RegisterRequest req) {
        // Check if current user is ADMIN
        User currentUser = authService.getCurrentUser();
        if (currentUser == null || !authService.isAdmin(currentUser)) {
            return ResponseEntity.status(403).build();
        }

        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(UserRole.AGENT);
        user.setPhoneNumber(req.getPhoneNumber());
        user.setEnabled(true);

        userRepository.save(user);

        return ResponseEntity.ok("Agent registered successfully");
    }

    // ---------- ENABLE 2FA (returns QR + otpauth URL) ----------
    @PostMapping("/2fa/enable")
    public ResponseEntity<TwoFactorResponse> enableTwoFactor() {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        TwoFactorResponse resp = twoFactorAuthService.enableTwoFactor(currentUser);
        return ResponseEntity.ok(resp);
    }

    // ---------- CONFIRM ENABLE 2FA ----------
    @PostMapping("/2fa/confirm")
    public ResponseEntity<Void> confirmEnableTwoFactor(@RequestBody TwoFactorRequest request) {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        boolean success = twoFactorAuthService.confirmEnableTwoFactor(currentUser, request.getCode());
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    // ---------- DISABLE 2FA ----------
    @PostMapping("/2fa/disable")
    public ResponseEntity<Void> disableTwoFactor() {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        twoFactorAuthService.disableTwoFactor(currentUser);
        return ResponseEntity.ok().build();
    }

    // ---------- 2FA STATUS ----------
    @GetMapping("/2fa/status")
    public ResponseEntity<TwoFactorResponse> getTwoFactorStatus() {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        TwoFactorResponse resp = new TwoFactorResponse();
        resp.setEnabled(currentUser.isTwoFactorEnabled());
        resp.setMessage(currentUser.isTwoFactorEnabled()
                ? "2FA is enabled"
                : "2FA is disabled");

        return ResponseEntity.ok(resp);
    }

    // ---------- PASSWORD RESET REQUEST ----------
    @PostMapping("/password/reset/request")
    public ResponseEntity<?> requestPasswordReset(
            @Valid @RequestBody PasswordResetRequest request) {
        try {
            passwordResetService.requestPasswordReset(request);
            return ResponseEntity.ok().build();
        } catch (RuntimeException ex) {
            System.err.println(">>> PASSWORD RESET REQUEST FAILED <<<");
            System.err.println("Error Message: " + ex.getMessage());
            ex.printStackTrace();
            // DEBUG: Return error in body
            return ResponseEntity.badRequest().body("Error: " + ex.getMessage());
        }
    }

    // ---------- PASSWORD RESET VERIFY (OTP) ----------
    @PostMapping("/password/reset/verify")
    public ResponseEntity<Void> verifyPasswordResetToken(@RequestBody PasswordResetConfirmRequest request) {
        // We reuse the DTO but only look at the token
        try {
            passwordResetService.verifyToken(request.getToken());
            return ResponseEntity.ok().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ---------- PASSWORD RESET CONFIRM ----------
    @PostMapping("/password/reset/confirm")
    public ResponseEntity<Void> confirmPasswordReset(
            @Valid @RequestBody PasswordResetConfirmRequest request) {
        try {
            passwordResetService.confirmPasswordReset(request);
            return ResponseEntity.ok().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Autowired
    private com.ticketsystem.service.UserService userService;

    // ---------- WHO AM I ----------
    @GetMapping("/me")
    public ResponseEntity<com.ticketsystem.dto.UserResponseDTO> getCurrentUser() {
        User user = authService.getCurrentUser();
        if (user == null)
            return ResponseEntity.status(401).build();

        com.ticketsystem.dto.UserResponseDTO dto = userService.getById(user.getId());
        try {
            java.nio.file.Files.writeString(
                    java.nio.file.Path.of("debug_log.txt"),
                    java.time.LocalDateTime.now() + " DEBUG: /me response: " + dto.getId() + " Role: " + dto.getRole()
                            + "\n",
                    java.nio.file.StandardOpenOption.CREATE,
                    java.nio.file.StandardOpenOption.APPEND);
        } catch (Exception e) {
        }

        return ResponseEntity.ok(dto);
    }
}
