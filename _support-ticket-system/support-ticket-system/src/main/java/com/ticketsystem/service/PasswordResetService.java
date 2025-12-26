package com.ticketsystem.service;

import com.ticketsystem.dto.PasswordResetConfirmRequest;
import com.ticketsystem.dto.PasswordResetRequest;
import com.ticketsystem.model.PasswordResetToken;
import com.ticketsystem.model.User;
import com.ticketsystem.repository.PasswordResetTokenRepository;
import com.ticketsystem.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class PasswordResetService {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void requestPasswordReset(PasswordResetRequest req) {
        System.out.println(">>> Looking for user with email: " + req.getEmail());
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("No user with this email found in database"));

        // Check for existing token or create new one (Upsert)
        PasswordResetToken token = tokenRepository.findByUser(user)
                .orElse(new PasswordResetToken());

        // Generate 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));

        token.setUser(user);
        token.setToken(otp); // Update token
        token.setCreatedAt(LocalDateTime.now());
        token.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        token.setUsed(false); // Reset used flag

        tokenRepository.save(token);

        // Send email
        System.out.println(">>> DEBUG OTP: " + otp + " <<<");
        try {
            emailService.sendPasswordResetEmail(user.getEmail(), otp);
        } catch (Exception e) {
            System.err.println("Failed to send email (Ignored for DEV mode). OTP is: " + otp);
        }

        // DEBUG: Write OTP to file always
        try {
            java.nio.file.Files.writeString(
                    java.nio.file.Path.of("debug_otp.txt"),
                    "OTP for " + user.getEmail() + ": " + otp + "\n",
                    java.nio.file.StandardOpenOption.CREATE,
                    java.nio.file.StandardOpenOption.TRUNCATE_EXISTING);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void verifyToken(String tokenString) {
        PasswordResetToken token = tokenRepository.findByToken(tokenString)
                .orElseThrow(() -> new RuntimeException("Invalid or unknown code"));

        if (token.isExpired()) {
            throw new RuntimeException("Code expired");
        }
    }

    public void confirmPasswordReset(PasswordResetConfirmRequest req) {
        PasswordResetToken token = tokenRepository.findByToken(req.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid or unknown code"));

        if (token.isExpired()) {
            throw new RuntimeException("Code expired");
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);

        // Invalidate token
        tokenRepository.delete(token);
    }
}
